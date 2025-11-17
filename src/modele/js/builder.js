import { loadGoogleLibs, getGoogleLibs } from "../../controller/js/googleAPI.js";

export class MapBuilder {
  constructor() {
    this.defaultPosition = { lat: 49.1193, lng: 6.1757 };
    this.defaultZoom = 20;
    this.routes = [];
    this.map = null;
    this.userMarker = null;
    this.navigation = false;
  }

  async initMap() {
    try {
      await loadGoogleLibs();
      const { Map } = getGoogleLibs();

      const mapElement = document.getElementById("map");
      if (!mapElement) throw new Error("Élément #map introuvable.");

      const map = new Map(mapElement, {
        center: this.defaultPosition,
        zoom: this.defaultZoom,
        mapId: "map",
        mapTypeId: "roadmap",
        disableDefaultUI: true,
      });

      this.map = map;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte :", error);
    }
  }
}
