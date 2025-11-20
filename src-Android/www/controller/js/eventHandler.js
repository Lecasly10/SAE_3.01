import { startRoute, removeRoute } from "./route.js";
import * as UI from "./UI.js";
import { phpFetch } from "./phpInteraction.js";

//Toutes les fonctions lier au différents events de l'app

//parking le plus proche
export async function handleAutoSearchClick(event, builder, userMarker) {
  event.preventDefault();
  UI.toggleLoader(true);

  try {
    let position = {
      lat: userMarker.position.lat,
      lng: userMarker.position.lng,
    };

    UI.toggleNavigationUI("CHARGEMENT...");

    const resultat = await phpFetch("closestParking.php", position);
    if (!resultat || !resultat.lat || !resultat.lng)
      throw new Error("Aucune donnée trouvé");
    if (isNaN(resultat.lat) || isNaN(resultat.lng))
      throw new Error("Coordonnées invalides");
    let destination = {
      lat: resultat.lat,
      lng: resultat.lng,
    };
    const name = resultat.name;
    handleNavigationEvent(builder, userMarker, destination, name);
  } catch (error) {
    UI.setupUI();
    console.error("Erreur : ", error);
  } finally {
    UI.toggleLoader(false);
  }
}

//Pour lancer le mode navigation
async function handleNavigationEvent(
  builder,
  userMarker,
  destination,
  destinationName
) {
  const origin = userMarker.position;
  startRoute(builder, origin, destination, "destParking");

  UI.setupUI();
  UI.emptyResultBox();

  UI.setResultTitle(destinationName);
  UI.setResultMessage("Voulez vous aller à ce parking ?");

  const { confirm, cancel } = UI.toggleConfirmBox();
  confirm.addEventListener("click", (e) => {
    e.preventDefault();
    builder.map.panTo(origin);
    builder.map.setZoom(25);
    UI.toggleNavigationUI(destinationName);
    builder.navigation = true;
  });

  cancel.addEventListener("click", (e) => {
    handleCrossIcon(e, builder, userMarker);
  });
}

//La recherche
export async function handleSearchBoxSubmit(event, builder, marker) {
  event.preventDefault();
  const query = UI.getSearchQuery().trim();

  if (query.length === 0) {
    UI.toggleResultContainer(false);
    return;
  }

  UI.toggleLoader(true);

  let search = {
    search: query,
  };

  const result = await phpFetch("search.php", search);
  UI.setResultTitle("Résultats");
  handleParkingList(result.parkings, builder, marker);
}

//Liste de tout les parkings
export async function handleListButton(event, builder, marker) {
  event.preventDefault();

  UI.toggleLoader(true);
  UI.emptySearchBox();

  const result = await phpFetch("search.php", {});

  UI.setResultTitle("Tous les Parkings");
  handleParkingList(result.parkings, builder, marker);
}

//Clique sur un parking dans une liste
export async function handleParkingClick(event, link, builder, userMarker) {
  event.preventDefault();
  UI.toggleLoader(true);

  try {
    const lat = parseFloat(link.dataset.lat);
    const lng = parseFloat(link.dataset.lng);
    if (isNaN(lat) || isNaN(lng)) throw new Error("Coordonnées invalides");
    const name = link.dataset.name;
    const destination = { lat: lat, lng: lng };

    handleNavigationEvent(builder, userMarker, destination, name);
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire :", error);
  } finally {
    UI.toggleLoader(false);
  }
}

//Load les infos d'un parking
export async function handleParkingInfoClick(event, button) {
  event.preventDefault();
  UI.toggleResultContainer(false);
  UI.toggleLoader(true);

  try {
    UI.emptyResultBox();
    UI.emptySearchBox();

    const id = button.value;
    const result = await phpFetch("parkingInfo.php", { id });
    const parking = result?.parking;

    if (!parking) throw new Error("Aucune donnée de stationnement trouvée.");

    UI.setResultTitle(parking.nom);

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

    UI.appendTextElements(infoBase, baseInfoList);

    const placesList = [
      ["PMR", parking.pmr],
      ["Moto électrique", parking.e2w],
      ["Voiture électrique", parking.eCar],
      ["Moto", parking.moto],
      ["Places Familles", parking.carpool],
    ];

    UI.appendTextElements(placesInfo, placesList);

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

      UI.appendTextElements(tarifInfo, tarifList);
    }

    const eInfo = document.createElement("p");
    eInfo.className = "text";
    eInfo.textContent = parking.info || "Aucune information supplémentaire.";
    info.appendChild(eInfo);

    [infoBase, placesInfo, tarifInfo, info].forEach((div) =>
      UI.appendResultBox(div)
    );
    UI.toggleResultContainer(true);
  } catch (error) {
    console.error("Erreur :", error);
    UI.setResultTitle("Erreur");
    UI.setResultMessage("Impossible de charger les informations du parking.");
  } finally {
    UI.toggleLoader(false);
  }
}

//Load une liste de parking
async function handleParkingList(parkings, builder, marker) {
  UI.emptyResultBox();
  if (!parkings) {
    UI.setResultTitle("Aucun résultats");
    UI.setResultMessage(":(");
  } else {
    parkings.forEach((parking) => {
      const container = document.createElement("div");
      container.className = "resultDiv";

      const button = document.createElement("a");
      button.value = parking["id"];
      button.className = "littleButton button fade";
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
      link.className = "item parking fade";
      link.textContent = nom + pLibres;
      link.title = "Cliqer pour lancer l'itiniraire";
      link.dataset.lat = parking["lat"];
      link.dataset.lng = parking["lng"];
      link.dataset.name = parking["nom"];

      link.addEventListener("click", (e) => {
        handleParkingClick(e, link, builder, marker);
      });

      button.addEventListener("click", (e) => {
        handleParkingInfoClick(e, button);
      });

      container.appendChild(button);
      container.appendChild(link);
      UI.appendResultBox(container);
    });
  }
  UI.toggleResultContainer(true);
  UI.toggleLoader(false);
}

//Stop ou annuler
export async function handleCrossIcon(event, builder, userMarker) {
  event.preventDefault();
  UI.emptySearchBox();

  if (builder.routes.length > 0) {
    removeRoute(builder, "destParking");
  }

  UI.setupUI();
  builder.map.setZoom(builder.defaultZoom);
  builder.map.panTo(userMarker.position);
}

//Fermer les différentes resultbox
export function handleCloseButton(event, builder) {
  event.preventDefault();
  UI.toggleResultContainer(false);

  if (builder.routes.length > 0) {
    removeRoute(builder, "destParking");
  }
}
