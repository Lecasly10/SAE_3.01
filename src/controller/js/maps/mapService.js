import { AppError } from "../errors/errors.js";
import { darkId, lightId } from "./styles.js";
import { Utils } from "../utils.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { UI } from "../ui/UI.js";

export class MapService {
  constructor(api) {
    this.apiService = api
    this.map = null;
    this.defaultPosition = { lat: 49.1193, lng: 6.1757 };
    this.defaultZoom = 18;
    this.defaultTilt = 0;
    this.navigationZoom = 20;
    this.navigationTilt = 60;
    this.userMarker = null;
    this.nightMode = false;
    this.mapMonitor = null;
    this.mapMarkers = new Map();
    this.markerWindow = null;
  }

  async getAllPark() {
    const parks = await this.apiService.phpFetch("parking/loadAll", {})
    return parks
  }

  async placeMarkOnMap() {
    let parks;
    try {
      parks = await this.getAllPark();

      parks.data.forEach(park => {
        if (park) {
          const pos = { lat: park.lat, lng: park.lng }
          const marker = this.addMarker(pos, `${park.nom}`, Utils.parkIcon, 0);

          this.mapMarkers.set(park.id, marker);
          marker.addListener("click", () => {
            this.openParkWindow(park, marker);
          })
        }
      });
    } catch (error) {
      handleError(error, "Parking Marker")
    }
  }

  openParkWindow(park, marker) {
    this.markerWindow?.close();
    this.buildParkWindow(park);
    this.markerWindow?.open({
      anchor: marker,
      map: this.map,
      shouldFocus: false,
    });
  }

  hideAllParkMark() {
    this.markerWindow?.close();
    this.mapMarkers.forEach((mark, id) => {
      UI.hide(mark);
    })
  }

  showAllParkMark() {
    this.mapMarkers.forEach((mark, id) => {
      UI.show(mark);
    })
  }


  async init() {
    const { Map } = this.apiService.googleLibs;
    const mapElement = document.getElementById("map");
    if (!mapElement) throw new AppError("Élément #map introuvable.");

    this.map = new Map(mapElement, {
      center: this.defaultPosition,
      zoom: this.defaultZoom,
      mapId: lightId,
      mapTypeId: "roadmap",
      disableDefaultUI: true,
    });

    if (!this.map) throw new AppError("La création de la map à échoué !")
    this.setNightMode();
    this.startMapMonitor();
    await this.placeMarkOnMap();
  }

  setNightMode() {
    this.nightMode = this.detectNight();
    if (this.nightMode)
      this.map.setOptions({
        mapId: darkId,
      });
    else
      this.map.setOptions({
        mapId: lightId,
      });
  }

  detectNight() {
    const now = new Date();
    const hour = now.getHours();

    return hour >= 20 || hour < 6;
  }

  startMapMonitor() {
    if (this.mapMonitor) return;

    this.mapMonitor = setInterval(() => {
      this.setNightMode();
    }, 120000);
  }

  stopMapMonitor() {
    if (this.mapMonitor) {
      clearInterval(this.mapMonitor);
      this.mapMonitor = null;
    }
  }

  setCamera(heading, tilt) {
    this.map.moveCamera({
      heading: heading,
      tilt: tilt,
    });
  }

  setCenter(pos = null) {
    this.map.panTo(pos ?? this.userMarker.position);
  }

  setZoom(zoom = null) {
    this.map.setZoom(zoom ?? this.defaultZoom);
  }

  setUserMarker(pos, message) {
    if (!this.userMarker)
      this.userMarker = this.addMarker(pos, message, Utils.carIcon);
    else
      this.userMarker.position = pos;
  }

  addMarker(pos, message, iconURL, zIndex = null) {
    const { AdvancedMarkerElement } = this.apiService.googleLibs;

    if (!this.map) {
      throw new AppError("La carte n'est pas initialisée !");
    }

    const icon = document.createElement("img");
    icon.src = iconURL;
    icon.style.width = "60px";
    icon.style.height = "60px";

    let zOpt = !zIndex ? {} : {
      zIndex: zIndex
    }

    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: pos,
      title: message,
      content: icon,
      ...zOpt,
    });

    return marker;
  }

  buildParkWindow(park) {
    const { InfoWindow } = this.apiService.googleLibs;

    if (!this.map) {
      throw new AppError("La carte n'est pas initialisée !");
    }

    const h = document.createElement("h3");
    h.textContent = park.nom;
    h.style.color = "black";
    h.style.fontWeight = "bolder";
    h.style.margin = "0";
    const divContent = document.createElement("div");
    divContent.style.color = "black";

    const addr = document.createElement("div");
    const type = document.createElement("div");
    const place = document.createElement("div");

    addr.textContent = `Adresse : ${park.address}`;
    type.textContent = `Structure : ${park.structure}`;
    place.textContent = `Structure : ${park.places}`;
    divContent.appendChild(addr);
    divContent.appendChild(type);
    divContent.appendChild(place);

    type.addEventListener("click", () => {
      this.hideAllParkMark();
    })

    const opt = {
      headerContent: h,
      content: divContent,
    }

    if (!this.markerWindow)
      this.markerWindow = new InfoWindow(opt)
    else {
      this.markerWindow.setContent(divContent);
      this.markerWindow.setHeaderContent(h);
    }

    if (!this.markerWindow)
      throw new AppError("Erreur dans la création de la fenêtre de ce parking");
  }

}

