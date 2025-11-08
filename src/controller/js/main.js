import { loadGoogleLibs, getGoogleLibs } from "./googleAPI.js";
import { mapOptions, defaultPosition } from "./mapConfig.js";
import { addMarker } from "./addMarkers.js";
import { createButton } from "./createButton.js";

// ==== CONST ====
const homeIcon = document.getElementById("home");
const crossIcon = document.getElementById("cross");
const topnav = document.getElementById("topnav");
const linkDiv = document.getElementById("rbox");
const searchBox = document.getElementById("searchbox");
const resultsDiv = document.getElementById("results");
const goCenterButton = createButton("centerButton");

const carIconURL = "https://cdn-icons-png.flaticon.com/512/8308/8308414.png";
const destinationIconURL =
  "https://cdn-icons-png.flaticon.com/512/4668/4668400.png";

// ==== INIT ====
async function initMap() {
  try {
    await loadGoogleLibs();
    const { Map, AdvancedMarkerElement, Route } = getGoogleLibs();

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
        userMarker.setMap(null)
        userMarker = await addMarker(
          map,
          position,
          "Votre Position",
          carIconURL
        )
        map.setCenter(position)
      },
      (error) => handleGeoError(error, map, userMarker),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    goCenterButton.addEventListener("click", () => {
      map.setCenter(userMarker.position);
    });

    document
      .querySelectorAll(".parking")
      .forEach((link) =>
        link.addEventListener("click", (e) =>
          handleParkingClick(e, link, map, userMarker, Route)
        )
      );

    setupUI();
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la carte :", error);
  }
}

async function updateUserMarker(map, marker, position) {
  try {
    
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du marqueur utilisateur :",
      error
    );
  }
}

async function handleGeoError(error, map, marker) {
  console.warn("Erreur de géolocalisation :", error);
  marker.setMap(null)
  marker = await addMarker(
          map,
          position,
          "Votre Position",
          carIconURL
        )
  map.setCenter(position)
}

async function handleParkingClick(event, link, map, userMarker, Route) {
  event.preventDefault();

  try {
    const lat = parseFloat(link.dataset.lat);
    const lng = parseFloat(link.dataset.lng);
    const name = link.dataset.name;
    const destination = { lat, lng };

    toggleNavigationUI(name);

    const destinationMarker = await addMarker(
      map,
      destination,
      "Votre destination",
      destinationIconURL
    );

    const routeRequest = {
      origin: userMarker.position,
      destination : destination,
      travelMode: "DRIVING",
      routingPreference: "TRAFFIC_AWARE",
      fields: ["path"],
    };

    const { routes } = await Route.computeRoutes(routeRequest);

    if (!routes?.length) {
      alert("Aucun itinéraire trouvé.");
      return;
    }

    routes[0].createPolylines().forEach((polyline) => polyline.setMap(map));
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire :", error);
  }
}

function toggleNavigationUI(destinationName) {
  homeIcon.style.display = "none";
  crossIcon.style.display = "flex";
  linkDiv.style.display = "none";

  topnav.innerHTML = "";
  const title = document.createElement("p");
  title.textContent = destinationName;
  Object.assign(title.style, {
    fontSize: "20px",
    fontWeight: "bold",
  });
  topnav.appendChild(title);
}

function setupUI() {
  homeIcon.style.display = "initial";
  crossIcon.style.display = "none";

  if (!searchBox || !resultsDiv) return;

  const query = searchBox.value.trim();
  if (query.length === 0 && resultsDiv.innerHTML !== "") {
    resultsDiv.innerHTML = "";
  }
}

// ==== Lancement ====
window.addEventListener("load", initMap);
