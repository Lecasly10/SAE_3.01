import {
  loadGoogleLibs,
  getGoogleLibs,
} from "../../controller/js/googleAPI.js";
import { lightId } from "../../controller/js/maps/styles.js";

export class MapBuilder {
  static instance = null;

  static init() {
    if (!MapBuilder.instance) {
      MapBuilder.instance = new MapBuilder();
    }
    return MapBuilder.instance;
  }

  static getInstance() {
    if (!MapBuilder.instance)
      throw new Error("Navigation n'a pas encore été initialisée !");
    return MapBuilder.instance;
  }

  constructor() {
    if (MapBuilder.instance) {
      throw new Error("Utilisez MapBuilder.init() au lieu de new MapBuilder()");
    }

    this.defaultPosition = { lat: 49.1193, lng: 6.1757 }; // Mairie de Metz
    this.defaultZoom = 20; // Zoom par défaut
    this.map = null; // Google Map
    this.userMarker = null; // Marqueur utilisateur
    this.nightMode = false; // Mode nuit
  }

  // INIT MAP
  async initMap() {
    try {
      await loadGoogleLibs();
      const { Map } = getGoogleLibs();

      const mapElement = document.getElementById("map");
      if (!mapElement) throw new Error("Élément #map introuvable.");

      const map = new Map(mapElement, {
        center: this.defaultPosition,
        zoom: this.defaultZoom,
        mapId: lightId,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
      });

      this.map = map;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte :", error);
    }
  }
}
