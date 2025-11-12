import { loadGoogleLibs, getGoogleLibs } from "./googleAPI.js";

export const defaultOptions = {
  defaultPosition: { lat: 49.1193, lng: 6.1757 }, //Mairie de Metz
  defaultZoom: 20,
};
//===Options===

export const mapOptions = {
  center: defaultOptions.defaultPosition,
  zoom: defaultOptions.defaultZoom,
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
      ...mapOptions,
    });

    return map;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la carte :", error);
    return null;
  }
}
