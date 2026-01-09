import { AppError } from "../errors/errors.js";
import { lightId } from "./styles.js";

export class MapService {
  constructor(api) {
    this.apiService = api
    this.defaultPosition = { lat: 49.1193, lng: 6.1757 };
    this.defaultZoom = 20;
    this.defaultAngle = 0;
    this.map = null;
    this.userMarker = null;
    this.nightMode = false;
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

  }
}

