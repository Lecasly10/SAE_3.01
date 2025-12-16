import { UI } from "../../modele/js/UI.js";
import { phpFetch } from "./phpInteraction.js";

export function createHandlers(builder, navigation, user) {

  async function handleSubmit(event) {
    user.createAccount = false;
    event.preventDefault();
    const {
      mail,
      pass,
      confPass,
      nameI,
      surnameI,
      telI,
      errorI
    } = UI.el;

    let errors = [];
    const isEmpty = (value) => !value || value.trim() === "";
    const isValidEmail = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidString = (string) =>
      /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)
    const isValidPhone = (phone) =>
      /^[0-9]{8,15}$/.test(phone);

    errorI.textContent = "";
    UI.hide(errorI);

    if (isEmpty(mail.value))
      errors.push("L’email est obligatoire.");
    else if (!isValidEmail(mail.value))
      errors.push("Email invalide.");

    if (isEmpty(pass.value))
      errors.push("Le mot de passe est obligatoire.");
    else if (pass.value.length < 8)
      errors.push("Le mot de passe doit contenir au moins 8 caractères.");

    if (!confPass.classList.contains("hidden")) {
      user.createAccount = true;

      if (isEmpty(confPass.value))
        errors.push("La confirmation du mot de passe est obligatoire.");
      else if (pass.value !== confPass.value)
        errors.push("Les mots de passe ne correspondent pas.");
      if (isEmpty(nameI.value))
        errors.push("Le prénom est obligatoire.");
      else if (!isValidString(nameI.value))
        errors.push("Nom invalide !")
      if (isEmpty(surnameI.value))
        errors.push("Le nom est obligatoire.");
      else if (!isValidString(surnameI.value))
        errors.push("Prénom invalide !")
      if (isEmpty(telI.value))
        errors.push("Le téléphone est obligatoire.");
      else if (!isValidPhone(telI.value))
        errors.push("Le téléphone doit contenir uniquement des chiffres (8 à 15).");
    }

    if (errors.length > 0) {
      user.createAccount = false;
      errorI.textContent = errors.join("\n");
      UI.show(errorI);
      return;
    }

    const res = await user.auth({
      name: nameI.value,
      surname: surnameI.value,
      tel: telI.value,
      mail: mail.value,
      password: pass.value,
    })

    if (res.status === "fail") {
      errorI.textContent = res.message
      UI.show(errorI);
    }

  }

  // Navigation vers une destination avec confirmation
  async function handleNavigation(destination) {
    await navigation.startNavigation(destination);

    const { confirm, cancel } = UI.togglePreview(destination);
    const bounds = navigation.route.bounds;
    builder.map.fitBounds(bounds);
    builder.map.panTo(bounds.getCenter());

    confirm.addEventListener("click", (e) => {
      e.preventDefault();
      builder.map.panTo(builder.userMarker.position);
      builder.map.setZoom(25);
      navigation.focus = true; //Suivre le marker
      UI.toggleNavigationUI(destination.name);
    });

    cancel.addEventListener("click", (e) => {
      handleStop(e);
    });
  }

  // Parking le plus proche
  async function handleAutoSearchClick(event) {
    event.preventDefault();
    UI.toggleLoader(true);

    try {
      UI.toggleNavigationUI("CHARGEMENT...");
      const closest = await navigation.closestParking();
      if (closest) {
        handleNavigation(closest);
      }
    } catch (error) {
      UI.setupUI();
      alert(error.message || error);
      console.error("Erreur handleAutoSearchClick :", error);
    } finally {
      UI.toggleLoader(false);
    }
  }

  // Cliquer sur un parking dans la liste
  async function handleParkingClick(event, link) {
    event.preventDefault();
    UI.toggleLoader(true);

    try {
      const lat = parseFloat(link.dataset.lat);
      const lng = parseFloat(link.dataset.lng);
      const name = link.dataset.name;
      const id = link.dataset.id;

      if (!id || isNaN(lat) || isNaN(lng)) {
        throw new Error("Coordonnées ou identifiant invalides");
      }

      const destination = { id, lat, lng, name };
      handleNavigation(destination);
    } catch (error) {
      alert(error.message || error);
      console.error("Erreur handleParkingClick :", error);
    } finally {
      UI.toggleLoader(false);
    }
  }

  // Soumission de la recherche
  async function handleSearchBoxSubmit(event) {
    event.preventDefault();
    const query = UI.getSearchQuery().trim();
    if (!query) {
      UI.toggleResultContainer(false);
      return;
    }

    UI.toggleLoader(true);

    try {
      const result = await phpFetch("search.php", { search: query });
      UI.setResultTitle("Résultats");
      handleParkingList(result.parkings);
    } catch (error) {
      console.error("Erreur handleSearchBoxSubmit :", error);
    } finally {
      UI.toggleLoader(false);
    }
  }

  // Liste de tous les parkings
  async function handleListButton(event) {
    event.preventDefault();
    UI.toggleLoader(true);
    UI.emptySearchBox();

    try {
      const result = await phpFetch("search.php", {});
      UI.setResultTitle("Tous les Parkings");
      handleParkingList(result.parkings);
    } catch (error) {
      console.error("Erreur handleListButton :", error);
    } finally {
      UI.toggleLoader(false);
    }
  }

  // Détails d’un parking
  async function handleParkingInfoClick(event, button) {
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
      displayParkingInfo(parking);
    } catch (error) {
      console.error("Erreur handleParkingInfoClick :", error);
      UI.setResultTitle("Erreur");
      UI.setResultMessage("Impossible de charger les informations du parking.");
    } finally {
      UI.toggleLoader(false);
    }
  }

  // Fonction pour afficher les infos
  function displayParkingInfo(parking) {
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
      ["Siret", parking.siret === 0 ? "Aucun" : parking.siret],
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
  }

  // Gestion de la liste de parkings
  function handleParkingList(parkings) {
    UI.emptyResultBox();
    if (!parkings || !parkings.length) {
      UI.setResultTitle("Aucun résultat");
      UI.setResultMessage(":(");
      return;
    }

    parkings.forEach((parking) => {
      const container = document.createElement("div");
      container.className = "resultDiv";

      const button = document.createElement("a");
      button.value = parking.id;
      button.className = "littleButton button fade";
      button.title = "Cliquez pour voir les informations";

      const icon = document.createElement("i");
      icon.className = "fa fa-info";
      icon.textContent = "INFO";
      icon.ariaHidden = "true";
      button.appendChild(icon);

      const link = document.createElement("a");
      link.className = "item parking fade";
      link.textContent =
        parking.nom +
        (parking.places_libres > 0
          ? ` | ${parking.places_libres} places libres`
          : parking.places_libres == -1
            ? ""
            : " | complet");
      link.title = "Cliquez pour lancer l'itinéraire";
      link.dataset.lat = parking.lat;
      link.dataset.lng = parking.lng;
      link.dataset.id = parking.id;
      link.dataset.name = parking.nom;

      link.addEventListener("click", (e) => handleParkingClick(e, link));
      button.addEventListener("click", (e) =>
        handleParkingInfoClick(e, button)
      );

      container.appendChild(button);
      container.appendChild(link);
      UI.appendResultBox(container);
    });

    UI.toggleResultContainer(true);
  }

  // Arrêter ou annuler la navigation

  async function handleStop(event) {
    event?.preventDefault?.();

    navigation.stopNavigation();
    UI.setupUI();
    UI.emptySearchBox();

    builder.map.setZoom(builder.defaultZoom);
    if (builder.userMarker) builder.map.panTo(builder.userMarker.position);
  }

  // Gestion cross icon
  async function handleCrossIcon(event) {
    handleStop(event);
  }

  // Fermer les resultbox
  function handleCloseButton(event) {
    event.preventDefault();
    UI.toggleResultContainer(false);
    UI.toggleAuth(false)
    navigation.stopNavigation();
  }

  function handleSettingButton(event) {
    event.preventDefault();
    if (user.isLogged) {
      handleSettings();
    }
    UI.toggleAuth(true)
  }

  async function handleSettings() {
    const { nameParam, mailParam, telParam, surnameParam } = UI.el;
    const data = await user.load(user.userId);
    if (!data) alert("Une erreur est survenu !");
    else {
      nameParam.value = data.name;
      surnameParam.value = data.surname;
      mailParam.value = user.mail;
      telParam.value = data.tel;

      UI.toggleSetting(true);
    }
  }

  //export
  return {
    handleAutoSearchClick,
    handleSearchBoxSubmit,
    handleCloseButton,
    handleCrossIcon,
    handleListButton,
    handleSettingButton,
    handleSubmit,
  };
}
