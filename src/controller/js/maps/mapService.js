import { AppError } from "../errors/errors.js";
import { darkId, lightId } from "./styles.js";
import { Utils } from "../utils.js";

export class MapService {
  constructor(api) {
    this.apiService = api
    this.defaultPosition = { lat: 49.1193, lng: 6.1757 };
    this.defaultZoom = 20;
    this.defaultAngle = 0;
    this.map = null;
    this.userMarker = null;
    this.nightMode = false;
    this.mapMonitor = null;
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
    this.nightMode();
    this.startMapMonitor();
  }

  setNightMode() {
    const now = new Date();
    const hour = now.getHours();
    const isNight = hour >= 20 || hour < 6;

    if (isNight && !this.nightMode) {
      this.nightMode = true;
      this.map.setOptions({
        mapId: darkId,
      });
    } else if (!isNight && this.nightMode) {
      this.nightMode = false;
      this.map.setOptions({
        mapId: lightId,
      });
    }
  }

  startMapMonitor() {
    if (this.mapMonitor) return;

    this.mapMonitor = setInterval(() => {
      this.setNightMode();
    }, 120000);
  }

  stopMapMonitor() {
    clearInterval(this.mapMonitor);
    this.mapMonitor = null;
  }

  setCamera(heading, tilt) {
    this.map.moveCamera({
      heading: heading,
      tilt: tilt,
    });
  }

  setCenter(pos = null) {
    this.map.setCenter(pos ?? this.userMarker.position);
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

}

