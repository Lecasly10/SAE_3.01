import { loadGoogleLibs, getGoogleLibs } from "./googleAPI.js";
import { mapOptions, defaultPosition } from "./mapConfig.js";
import { addMarker } from "./addMarkers.js";

async function initMap() {
  await loadGoogleLibs();
  const { Map, AdvancedMarkerElement } = getGoogleLibs();

  const carURL = "https://cdn-icons-png.flaticon.com/512/8308/8308414.png";

  // Initialisation
  const map = new Map(document.getElementById("map"), {
    center: defaultPosition,
    ...mapOptions,
  });

  // Marqueur de base
  let marker = await addMarker(map, defaultPosition, "Votre position", carURL);

  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
    return;
  }

  navigator.geolocation.watchPosition(
    async (position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      marker.setMap(null);
      marker = await addMarker(
        map,
        pos,
        "Votre position",
        "https://cdn-icons-png.flaticon.com/512/8308/8308414.png"
      );
      map.setCenter(pos);
    },
    async (error) => {
      console.log("Erreur de géolocalisation :", error);
      marker.setMap(null);
      marker = await addMarker(
        map,
        defaultPosition,
        "Votre position",
        "https://cdn-icons-png.flaticon.com/512/8308/8308414.png"
      );
      map.setCenter(defaultPosition);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );

  // Gestion du bouton de recentrage
  const goCenterButton = createButton();
  goCenterButton.addEventListener("click", () => {
    map.setCenter(marker.position);
  });
}
//button
function createButton() {
  const controlButton = document.getElementById("button");
  controlButton.style.cursor = "pointer";
  controlButton.style.textAlign = "center";
  controlButton.title = "Itinéraire";
  controlButton.type = "button";
  return controlButton;
}

window.addEventListener("load", initMap);
