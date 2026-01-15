import { AppError } from "../errors/errors.js";
import { darkId, lightId } from "./styles.js";
import { Utils } from "../utils.js";
import { handleError } from "../errors/globalErrorHandling.js";

export class MapService {
  constructor(api) {
    this.apiService = api
    this.map = null;
    this.defaultPosition = { lat: 49.1193, lng: 6.1757 };
    this.defaultZoom = 18;
    this.navigationZoom = 20;
    this.navigationTilt = 60;
    this.defaultTilt = 0;
    this.userMarker = null;
    this.nightMode = false;
    this.mapMonitor = null;
    this.mapMarkers = new Map();
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
          const marker = this.addMarker(pos, `${park.nom}`, Utils.parkIcon);

          this.mapMarkers.set(park.id, marker);

          marker.addListener("click", () => {
            this.buildParkWindow(park).open({
              anchor: marker,
              map,
              shouldFocus: false,
            });
          })
        }
      });
    } catch (error) {
      handleError(error, "Parking Marker")
    }
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

  addMarker(pos, message, iconURL) {
    const { AdvancedMarkerElement } = this.apiService.googleLibs;

    if (!this.map) {
      throw new AppError("La carte n'est pas initialisée !");
    }

    const icon = document.createElement("img");
    icon.src = iconURL;
    icon.style.width = "60px";
    icon.style.height = "60px";

    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: pos,
      title: message,
      content: icon,
    });

    return marker;
  }

  buildParkWindow(park) {
    const { InfoWindow } = this.apiService.googleLibs;

    if (!this.map) {
      throw new AppError("La carte n'est pas initialisée !");
    }

    const window = new InfoWindow({
      headerContent: `<h3>${park.nom}</h3>`,
      content: `<p>${park.address}</p>`,
    })

    return window
  }

}

