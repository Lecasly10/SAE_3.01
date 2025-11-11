import * as element from "./htmlElement.js";
import { startRoute } from "./route.js";
import {
  toggleNavigationUI,
  setResultTitle,
  toggleLoader,
  emptyResultBox,
  setResultMessage,
  appendTextElements,
} from "./UI.js";
import { phpFetch } from "./phpInteraction.js";

export async function handleAutoSearchClick(event, map, userMarker) {
  event.preventDefault();
  toggleLoader(true);

  try {
    let position = {
      lat: userMarker.position.lat,
      lng: userMarker.position.lng,
    };

    toggleNavigationUI("CHARGEMENT...");

    const resultat = await phpFetch("closestParking.php", position);
    if (!resultat || !resultat.lat || !resultat.lng)
      throw new Error("Aucune donnée trouvé");
    let destination = {
      lat: resultat.lat,
      lng: resultat.lng,
    };
    const name = resultat.name;

    toggleNavigationUI(name);
    startRoute(map, userMarker.position, destination, "destParking");
  } catch (error) {
    console.error("Erreur : ", error);
  } finally {
    toggleLoader(false);
  }
}

export async function handleParkingClick(event, link, map, userMarker) {
  event.preventDefault();
  toggleLoader(true);

  try {
    const lat = parseFloat(link.dataset.lat);
    const lng = parseFloat(link.dataset.lng);
    if (isNaN(lat) || isNaN(lng)) throw new Error("Coordonnées invalides");
    const name = link.dataset.name;
    const destination = { lat: lat, lng: lng };

    toggleNavigationUI(name);
    startRoute(map, userMarker.position, destination, "destParking");
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire :", error);
  } finally {
    toggleLoader(false);
  }
}

export async function handleParkingInfoClick(event, button) {
  event.preventDefault();
  toggleLoader(true);

  try {
    emptyResultBox();

    const id = button.value;
    const result = await phpFetch("parkingInfo.php", { id });
    const parking = result?.parking;

    if (!parking) throw new Error("Aucune donnée de stationnement trouvée.");

    const box = element.resultBox;
    setResultTitle(parking.nom);

    const infoBase = document.createElement("div");
    const placesInfo = document.createElement("div");
    const tarifInfo = document.createElement("div");
    const info = document.createElement("div");

    const pLibres =
      parking.places_libres > 0
        ? `${parking.places_libres}/${parking.places}`
        : parking.places;

    const baseInfoList = [
      ["Adresse", parking.address],
      ["Coordonnées", `${parking.lat} - ${parking.lng}`],
      ["Url", parking.url],
      ["Type", parking.structure],
      ["Hauteur Max.", `${parking.max_height} cm`],
      ["Insee", parking.insee],
      ["Siret", parking.siret],
      ["Utilisateur", parking.user],
      ["Gratuit", parking.free ? "Oui" : "Non"],
      ["Places", pLibres],
    ];

    appendTextElements(infoBase, baseInfoList);

    const placesList = [
      ["PMR", parking.pmr],
      ["Moto électrique", parking.e2w],
      ["Voiture électrique", parking.eCar],
      ["Moto", parking.moto],
      ["Places Familles", parking.carpool],
    ];

    appendTextElements(placesInfo, placesList);

    if (!parking.free) {
      const rates = {
        "Prix PMR": parking.pmr_rate,
        "Prix 1h": parking.rate_1h,
        "Prix 2h": parking.rate_2h,
        "Prix 3h": parking.rate_3h,
        "Prix 4h": parking.rate_4h,
        "Prix 24h": parking.rate_24h,
      };

      const tarifList = Object.entries(rates).map(([label, value]) => [
        label,
        value > 0 ? `${value}€` : "Gratuit",
      ]);

      tarifList.push(
        ["Abonnement résident", `${parking.resident_sub}€ /an`],
        ["Abonnement non résident", `${parking.nonresident_sub}€ /an`]
      );

      appendTextElements(tarifInfo, tarifList);
    }

    const eInfo = document.createElement("p");
    eInfo.className = "text";
    eInfo.textContent = parking.info || "Aucune information supplémentaire.";
    info.appendChild(eInfo);

    [infoBase, placesInfo, tarifInfo, info].forEach((div) =>
      box.appendChild(div)
    );
  } catch (error) {
    console.error("Erreur :", error);
    setResultTitle("Erreur");
    setResultMessage("Impossible de charger les informations du parking.");
  } finally {
    toggleLoader(false);
  }
}

export async function handleParkingList(parkings, map, marker) {
  emptyResultBox();
  if (!parkings) {
    setResultTitle("Aucun résultats");
    setResultMessage(":(");
  } else {
    parkings.forEach((parking) => {
      const container = document.createElement("div");
      container.className = "resultDiv";

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
      const pLibres =
        parking["places_libres"] > 0
          ? parking["places_libres"] + " places libres"
          : "complet";

      const link = document.createElement("a");
      link.className = "item parking";
      link.textContent = nom + pLibres;
      link.title = "Cliqer pour lancer l'itiniraire";
      link.style.cursor = "pointer";
      link.dataset.lat = parking["lat"];
      link.dataset.lng = parking["lng"];
      link.dataset.name = parking["nom"];

      link.addEventListener("click", (e) => {
        handleParkingClick(e, link, map, marker);
      });

      button.addEventListener("click", (e) => {
        handleParkingInfoClick(e, button, map, marker);
      });

      container.appendChild(button);
      container.appendChild(link);
      element.resultBox.appendChild(container);
    });
  }
  element.resultContainer.style.visibility = "visible";
  toggleLoader(false);
}
