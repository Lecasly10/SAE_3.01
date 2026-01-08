import { ApiService } from "../api/apiService.js";
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
    this.debug = true;
  }

  async init() {
    try {
      const { Map } = this.apiService.googleLibs;
      const mapElement = document.getElementById("map");
      if (!mapElement) throw new Error("Élément #map introuvable.");

      this.map = new Map(mapElement, {
        center: this.defaultPosition,
        zoom: this.defaultZoom,
        mapId: lightId,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
      });

    } catch (err) {
      alert("Erreur lors de l'initialisation de la carte")
      console.error("Erreur lors de l'initialisation de la carte :", err);
    }
  }
}
