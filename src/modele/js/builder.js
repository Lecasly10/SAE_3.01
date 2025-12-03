import {
  loadGoogleLibs,
  getGoogleLibs,
} from "../../controller/js/googleAPI.js";
import { lightId } from "../../controller/js/maps/styles.js";

//Classe pour créer et initialiser la map avec des params par défaut
export class MapBuilder {
  constructor() {
    this.defaultPosition = { lat: 49.1193, lng: 6.1757 }; //Mairie de Metz
    this.defaultZoom = 20; //le zoom par défaut
    this.routes = []; //les routes
    this.map = null; //L'objet map de google map
    this.userMarker = null; //marqueur utilisateur
    this.navigation = false; //Mode navigation
    this.nightMode = false; // Mode nuit
  }

  async initMap() {
    //initialisation map
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
