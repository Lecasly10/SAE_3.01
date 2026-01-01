import { UI } from "./ui/UI.js";
import { phpFetch } from "./api/phpInteraction.js";
import { Utils } from "./utils.js";

export function createHandlers(builder, navigation, user) {

  async function handleSubmit(event) {
    const { isEmpty, isValidEmail, isValidPhone, isValidString } = Utils
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

    if (res.status !== "success" && res.message) {
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
      navigation.startFollowRoute();
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
    event.preventDefault();

    navigation.stopNavigation();
    UI.setupUI();
    UI.emptySearchBox();

    builder.map.setZoom(builder.defaultZoom);
    if (builder.userMarker) builder.map.panTo(builder.userMarker.position);
  }

  // Fermer les resultbox
  function handleCloseButton(event) {
    event.preventDefault();
    UI.toggleResultContainer(false);
    navigation.stopNavigation();
  }

  function handleSettingButton(event) {
    event.preventDefault();
    if (user.isLogged) {
      handleSettings();
    } else {
      UI.toggleAuth(true);
    }
  }

  async function handleCar(event) {
    event.preventDefault();
    UI.resetCarEditList();
    const { listvoit } = UI.el;
    listvoit.value = "none";

    let data = await user.load(user.userId);
    if (!data) alert("Une erreur est survenu !");
    else {
      if (data.vehicules) {
        data.vehicules.forEach(veh => {
          listvoit.add(new Option(`${veh.plate}`, JSON.stringify(veh)));
        });
      }
    }
  }

  async function handleCarEdit(event) {
    event.preventDefault()
    const { listvoit, plateParam, vHeightParam, vMotorParam, vTypeParam, editTitle } = UI.el;
    let b = event.target.value
    if (b == "new") {
      listvoit.value = "none"
      editTitle.textContent = "NOUVEAU"
      plateParam.value = "";
      vHeightParam.value = "";
    } else {
      try {
        let data = JSON.parse(listvoit.value)
        editTitle.textContent = "MODIFICATION"
        plateParam.value = data.plate;
        vHeightParam.value = data.height;
        vMotorParam.value = data.motor;
        vTypeParam.value = data.type;
      } catch (e) {
        console.error("Erreur : ", e)
        alert("Une erreur est survenue")
      }
    }

  }

  async function handleCarEditSubmit(event) {
    const { listvoit, plateParam, vHeightParam, vMotorParam, vTypeParam, errorV } = UI.el;
    const { isEmpty, isValidPlate, isValidPositiveNumber } = Utils

    let id;
    let errors = [];
    if (listvoit.value === "none" || listvoit.value === "") id = user.userId;
    else id = JSON.parse(listvoit.value).id;

    errorV.textContent = "";
    UI.hide(errorV);

    if (isEmpty(plateParam.value))
      errors.push("La plaque est obligatoire");
    else if (!isValidPlate(plateParam.value))
      errors.push("Format de plaque incorrect");
    if (isEmpty(vHeightParam.value))
      errors.push("La hauteur du véhicule est obligatoire");
    else if (!isValidPositiveNumber(vHeightParam.value))
      errors.push("La hauteur du véhicule doit être un nombre entier positif non nul");
    if (isEmpty(vMotorParam.value))
      errors.push("Le type du moteur est obligatoire");
    if (isEmpty(vTypeParam.value))
      errors.push("Le type du véhicule est obligatoire");


    if (errors.length > 0) {
      errorV.textContent = errors.join("\n");
      UI.show(errorV);
      return;
    }
    errorV.textContent = "";

    const info = {
      id: id,
      plate: plateParam.value,
      height: vHeightParam.value,
      type: vTypeParam.value,
      motor: vMotorParam.value
    }
    let resp;
    if (listvoit.value === "none" || listvoit.value === "") {
      resp = await user.createCar(info);
    } else {
      resp = await user.updateCar(info);
    }

    if (resp.status && resp.status === "success") {
      await handleCar(event);
      await handleSettings();
      UI.toggleVoitureEdit(false);
    } else if (resp.message) {
      errorV.textContent = resp.message
      UI.show(errorV);
    }

  }

  async function handleDeleteCar(event) {
    event.preventDefault();
    const { listvoit } = UI.el;

    if (listvoit.value === "none" || listvoit === "") return;

    const id = JSON.parse(listvoit.value).id;
    if (confirm("Voulez vraiment supprimer ce véhicule")) {
      let res = await user.deleteCar(id);
      if (res.status != "success" && res.message) {
        console.log(res.message)
        alert(res.message)
      } else {
        UI.notify("Véhicule", "Véhicule supprimé avec succès !")
        UI.resetCarEditList();
        await handleSettings(event);
        await handleCar(event);
      }
    }
  }

  async function handleSettings() {
    const {
      nameParam, mailParam, telParam,
      surnameParam, maxDistParam, maxHBudgetParam,
      pmrParam, coverParam, freeParam, carParam } = UI.el;
    let data = await user.load(user.userId);
    if (!data) alert("Une erreur est survenu !");
    else {
      UI.resetCarSettList();
      nameParam.value = data.name;
      surnameParam.value = data.surname;
      mailParam.value = user.mail;
      telParam.value = data.tel;
      pmrParam.checked = data.pmr == true;
      coverParam.checked = data.covered == true;
      freeParam.checked = data.free == true;
      maxDistParam.value = data.maxDistance;
      maxHBudgetParam.value = data.maxHourly;

      if (data.vehicules) {
        data.vehicules.forEach(veh => {
          if (user.data && user.data.vehId == veh.id) {
            carParam.add(new Option(`${veh.plate}`, veh.id, true, true))
          } else
            carParam.add(new Option(`${veh.plate}`, veh.id))
        });
      }
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    const { isEmpty, isValidPhone, isValidString, isValidNumber } = Utils
    const {
      nameParam, telParam,
      surnameParam, maxDistParam, maxHBudgetParam,
      pmrParam, coverParam, freeParam, errorS, carParam } = UI.el;

    let errors = [];

    errorS.textContent = "";
    UI.hide(errorS);

    if (isEmpty(nameParam.value))
      errors.push("Le prénom est obligatoire.");
    else if (!isValidString(nameParam.value))
      errors.push("Prénom invalide !")
    if (isEmpty(surnameParam.value))
      errors.push("Le nom est obligatoire.");
    else if (!isValidString(surnameParam.value))
      errors.push("nom invalide !")
    if (isEmpty(telParam.value))
      errors.push("Le téléphone est obligatoire.");
    else if (!isValidPhone(telParam.value))
      errors.push("Le téléphone doit contenir uniquement des chiffres (8 à 15).");
    if (isEmpty(maxDistParam.value))
      errors.push("La distance maximal est obligatoire")
    else if (!isValidNumber(maxDistParam.value))
      errors.push("La distance maximal doit etre un nombre positif")
    if (isEmpty(maxHBudgetParam.value))
      errors.push("Le budget maximal par heure est obligatoire")
    else if (!isValidNumber(maxHBudgetParam.value))
      errors.push("Le budget maximal par heure doit etre un nombre positif")


    if (errors.length > 0) {
      errorS.textContent = errors.join("\n");
      UI.show(errorS);
      return;
    }

    const res = await user.update({
      id: user.userId,
      name: nameParam.value,
      surname: surnameParam.value,
      tel: telParam.value,
      free: freeParam.checked,
      pmr: pmrParam.checked,
      covered: coverParam.checked,
      maxHourly: maxHBudgetParam.value ? maxHBudgetParam.value : 0,
      maxDist: maxDistParam.value ? maxDistParam.value : 0,
      vehId: carParam.value
    })

    if ((res.status && res.status !== "success") && res.message) {
      errorS.textContent = res.message
      UI.show(errorS);
    }

  }

  //export
  return {
    handleAutoSearchClick,
    handleSearchBoxSubmit,
    handleCloseButton,
    handleStop,
    handleListButton,
    handleSettingButton,
    handleSubmit,
    handleUpdate,
    handleCar,
    handleCarEdit,
    handleDeleteCar,
    handleCarEditSubmit
  };
}
