import { UI } from "../ui/UI.js";

export function initMapEvent(services) {
    const builder = services.mapService
    const navigation = services.navigationService

    const { autoSearchButton, searchBox, listButton,
        crossIcon, closeButton, goCenterButton } = UI.el

    let tId = null;
    builder.map.addListener('dragstart', () => {
        if (navigation.followingRoute) {
            if (tId) clearTimeout(tId);
            navigation.pauseFollowRoute();
            tId = setTimeout(() => {
                navigation.startFollowRoute();
                tId = null;
            }, 3000);
        }
    });

    goCenterButton.addEventListener("click", () => {
        UI.notify("MAP", "Map recentré !", false, 2);
        builder.map.panTo(builder.userMarker.position);
    });

    //Rechercher le parking le plus proche
    autoSearchButton.addEventListener("click", (e) => {
        handleClosestButton(e);
    });

    //Rechercher parkings
    searchBox.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            handleSearchBoxSubmit(e);
        }
    });

    //Lister les parkings
    listButton.addEventListener("click", async (e) => {
        handleParkingListButton(e);
    });

    //Annuler ou stop
    if (crossIcon) {
        crossIcon.addEventListener("click", (e) => {
            handleCrossButton(e);
        });
    }

    //Fermer les box
    closeButton.addEventListener("click", (e) => {
        handleCloseButton(e);
    });

    async function handleNavigation(destination) {
        await navigation.startNavigation(destination);
        navigation.startPreview();
    }

    // Parking le plus proche
    async function handleClosestButton(event) {
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
            console.error("Erreur :", error);
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
            alert("Une Erreur est survenue, veuillez réessayer !");
            console.error("Erreur :", error);
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
            const result = await services.apiService.phpFetch("parking/search", { search: query });
            UI.setResultTitle("Résultats");
            handleParkingList(result.parkings);

        } catch (error) {
            console.error("Erreur handleSearchBoxSubmit :", error);
        } finally {
            UI.toggleLoader(false);
        }
    }

    // Liste de tous les parkings
    async function handleParkingListButton(event) {
        event.preventDefault();
        UI.toggleLoader(true);
        UI.emptySearchBox();

        try {
            const result = await services.apiService.phpFetch("parking/search", {});
            UI.setResultTitle("Tous les Parkings");
            handleParkingList(result.data);
        } catch (error) {
            if (error instanceof Error)
                console.error("[ERREUR] map.events - handleListButton :", error);
            alert("Une erreur s'est produite, veuillez réesseyez !")
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
            const result = await services.apiService.phpFetch("parking/load", { id });
            const parking = result.data;

            if (!parking) throw new Error("Aucune donnée de stationnement trouvée.");

            UI.setResultTitle(parking.nom);
            displayParkingInfo(parking);
        } catch (error) {
            if (error instanceof Error)
                console.error("[ERROR] map.events - handleParkingInfoClick : ", error);
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
        } else {
            parkings.forEach((parking) => {
                const container = document.createElement("div");
                container.className = "resultDiv";

                const button = document.createElement("a");

                button.value = parking.id;
                button.className = "littleButton button fade";
                button.title = "Cliquez pour voir les informations";
                button.dataset.data = JSON.stringify(parking);

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
        }

        UI.toggleResultContainer(true);
    }


    // Fermer les resultbox
    function handleCloseButton(event) {
        event.preventDefault();
        UI.toggleResultContainer(false);
        navigation.stopNavigation();
    }

    async function handleCrossButton(event) {
        event.preventDefault();

        navigation.stopNavigation();
        UI.setupUI();
        UI.emptySearchBox();

        builder.map.setZoom(builder.defaultZoom);
        if (builder.userMarker) builder.map.panTo(builder.userMarker.position);
    }
}