import * as element from "./htmlElement.js";
import { startRoute } from "./route.js";
import { toggleNavigationUI } from "./UI.js";
import { phpFetch } from "./phpInteraction.js";

export async function handleAutoSearchClick(event, map, userMarker) {
  event.preventDefault();
  let position = {
    lat: userMarker.position["lat"],
    lng: userMarker.position["lng"],
  };

  element.loader.style.display = "block";
  toggleNavigationUI("CHARGEMENT...");

  const resultat = await phpFetch("closestParking.php", position);
  let destination = {
    lat: resultat["lat"],
    lng: resultat["lng"],
  };
  const name = resultat["name"];

  toggleNavigationUI(name);
  element.loader.style.display = "none";
  const routeId = "destParking";
  startRoute(map, userMarker.position, destination, routeId);
}

export async function handleParkingClick(event, link, map, userMarker) {
  event.preventDefault();

  try {
    const lat = parseFloat(link.dataset.lat);
    const lng = parseFloat(link.dataset.lng);
    const name = link.dataset.name;
    const destination = { lat: lat, lng: lng };

    toggleNavigationUI(name);
    const routeId = "destParking";
    startRoute(map, userMarker.position, destination, routeId);
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire :", error);
  }
}

export async function handleParkingList(parkings, map, marker) {
  element.resultBox.innerHTML = "";
  if (!parkings) {
    const text = document.createElement("p");
    text.textContent = "Aucun résultats";
    element.resultBox.appendChild(text);
  } else {
    parkings.forEach((parking) => {
      const container = document.createElement("div");

      const button = document.createElement("a");
      button.value = parking["id"];
      button.className = "littleButton button";
      button.title = "Cliquez pour voir les informations";

      const icon = document.createElement("i");
      icon.className = "fa fa-info";
      icon.textContent = "NFO";
      icon.ariaHidden = "true";

      button.appendChild(icon);

      const nom = parking["nom"] + " | ";
      const places = parking["places"] + " places";
      const pLibres =
        parking["places_libres"] > 0
          ? " -" + parking["places_libres"] + " libres"
          : " - complet";

      const link = document.createElement("a");
      link.className = "item parking";
      link.textContent = nom + places + pLibres;
      link.title = "Cliqer pour lancer l'itiniraire";
      link.style.cursor = "pointer";
      link.dataset.lat = parking["lat"];
      link.dataset.lng = parking["lng"];
      link.dataset.name = parking["nom"];

      link.addEventListener("click", (e) => {
        handleParkingClick(e, link, map, marker);
      });

      container.appendChild(button);
      container.appendChild(link);
      element.resultBox.appendChild(container);
    });
  }
  element.resultContainer.style.visibility = "visible";
  element.loader.style.display = "none";
}
