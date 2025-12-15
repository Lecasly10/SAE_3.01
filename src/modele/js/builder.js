import {
  loadGoogleLibs,
  getGoogleLibs,
} from "../../controller/js/googleAPI.js";
import { lightId } from "../../controller/js/maps/styles.js";

export class MapBuilder {
  static instance = null;

  static init() {
    if (!MapBuilder.instance) MapBuilder.instance = new MapBuilder();
    return MapBuilder.instance;
  }

  static getInstance() {
    if (!MapBuilder.instance)
      throw new Error("MapBuilder non initialisé.");
    return MapBuilder.instance;
  }

  constructor() {
    if (MapBuilder.instance) throw new Error("Builder déjà init !");
    this.defaultPosition = { lat: 49.1193, lng: 6.1757 };
    this.defaultZoom = 20;
    this.map = null;
    this.userMarker = null;
    this.nightMode = false;
    this.debug = true;
  }

  async initMap() {
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
    } catch (err) {
      console.error("Erreur lors de l'initialisation de la carte :", err);
    }
  }
}
