import { loadGoogleLibs, getGoogleLibs } from "./googleAPI.js";
import { mapOptions, defaultPosition } from "./mapConfig.js";
import { addMarker } from "./addMarkers.js";
import { startRoute } from "./startRoute.js";
import { setupUI, toggleNavigationUI } from "./UI.js";

// ==== CONST ====
const goCenterButton = document.getElementById("centerButton");
const autoSearchButton = document.getElementById("autoSearchButton");

const carIconURL = "https://cdn-icons-png.flaticon.com/512/8308/8308414.png";

// ==== INIT ====
async function initMap() {
  try {
    await loadGoogleLibs();
    const { Map } = getGoogleLibs();

    const mapElement = document.getElementById("map");
    if (!mapElement) throw new Error("Élément #map introuvable.");

    const map = new Map(mapElement, {
      center: defaultPosition,
      ...mapOptions,
    });

    let userMarker = await addMarker(
      map,
      defaultPosition,
      "Votre position",
      carIconURL
    );

    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const position = { lat: coords.latitude, lng: coords.longitude };
        userMarker.setMap(null);
        userMarker = await addMarker(
          map,
          position,
          "Votre Position",
          carIconURL
        );
        map.setCenter(position);
      },
      (error) => handleGeoError(error, map, userMarker, defaultPosition),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    goCenterButton.addEventListener("click", () => {
      map.setCenter(userMarker.position);
    });

    autoSearchButton.addEventListener("click", (e) => {
      handleAutoSearchClick(e, map, userMarker);
    });

    document
      .querySelectorAll(".parking")
      .forEach((link) =>
        link.addEventListener("click", (e) =>
          handleParkingClick(e, link, map, userMarker)
        )
      );

    setupUI();
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la carte :", error);
  }
}

async function handleGeoError(error, map, marker, position) {
  console.warn("Erreur de géolocalisation :", error);
  marker.setMap(null);
  marker = await addMarker(map, position, "Votre Position", carIconURL);
  map.setCenter(position);
}

function handleAutoSearchClick(event, map, userMarker) {
  event.preventDefault();
  let position = {
    lat: userMarker.position["lat"],
    lng: userMarker.position["lng"],
  };

  toggleNavigationUI("CHARGEMENT...");

  const param = new URLSearchParams();

  for (const key in position) {
    param.append(key, position[key]);
  }

  fetch("postPosition.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: param.toString(),
  })
    .then((response) => response.json())
    .then((resultat) => {
      let destination = {
        lat: resultat["lat"],
        lng: resultat["lng"],
      };
      const name = resultat["name"];

      toggleNavigationUI(name);
      startRoute(map, userMarker.position, destination);
    })
    .catch((erreur) => console.error("Erreur :", erreur));
}

async function handleParkingClick(event, link, map, userMarker) {
  event.preventDefault();

  try {
    const lat = parseFloat(link.dataset.lat);
    const lng = parseFloat(link.dataset.lng);
    const name = link.dataset.name;
    const destination = { lat: lat, lng: lng };

    toggleNavigationUI(name);
    startRoute(map, userMarker.position, destination);
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire :", error);
  }
}

// ==== Lancement ====
window.addEventListener("load", initMap);
