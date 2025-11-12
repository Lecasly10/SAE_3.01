import { loadGoogleLibs, getGoogleLibs } from "./googleAPI.js";
export const defaultPosition = { lat: 49.1193, lng: 6.1757 }; //Mairie de Metz

//===Options===

export const mapOptions = {
  zoom: 20,
  mapId: "map",
  mapTypeId: "roadmap",
  disableDefaultUI: true,
};

//===Init Map===

export async function initMap() {
  try {
    await loadGoogleLibs();
    const { Map } = getGoogleLibs();

    const mapElement = document.getElementById("map");
    if (!mapElement) throw new Error("Élément #map introuvable.");

    const map = new Map(mapElement, {
      center: defaultPosition,
      ...mapOptions,
    });

    const trafficLayer = new google.maps.TrafficLayer();

    trafficLayer.setMap(map);

    return map;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la carte :", error);
    return null;
  }
}
