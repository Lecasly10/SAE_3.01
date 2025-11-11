import { loadGoogleLibs, getGoogleLibs } from "./googleAPI.js";
import { mapOptions, defaultPosition } from "./mapConfig.js";
import { setupUI } from "./UI.js";
import { initEvent } from "./event.js";
import { geolocation, getPositionOnce } from "./geolocalisation.js";

// ==== CONST ====
globalThis.carIconURL =
  "https://cdn-icons-png.flaticon.com/512/8308/8308414.png";

// ==== INIT ====
async function initMap() {
  try {
    await loadGoogleLibs();
    const { Map } = getGoogleLibs();

    const mapElement = document.getElementById("map");
    if (!mapElement) throw new Error("Élément #map introuvable.");

    const map = new Map(mapElement, {
      center: { lat: 0, lng: 0 },
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

// ==== MAIN ====
globalThis.addEventListener("load", async (e) => {
  globalThis.routes = globalThis.routes || [];
  const map = await initMap();
  setupUI();

  let userMarker = await getPositionOnce(map, defaultPosition);
  userMarker = await geolocation(map, defaultPosition);

  await initEvent(map, userMarker);
});
