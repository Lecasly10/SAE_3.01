import {
  loadGoogleLibs,
  getGoogleLibs,
} from "../api/googleAPI.js";
import { lightId } from "./styles.js";

export class MapService {
  constructor() {
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
      await loadGoogleLibs();
      const { Map } = getGoogleLibs();
      const mapElement = document.getElementById("map");
      if (!mapElement) throw new Error("Élément #map introuvable.");

      this.map = new Map(mapElement, {
        center: this.defaultPosition,
        zoom: this.defaultZoom,
        mapId: lightId,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
      });

      return this
    } catch (err) {
      alert("Erreur lors de l'initialisation de la carte")
      console.error("Erreur lors de l'initialisation de la carte :", err);
    }
  }
}
