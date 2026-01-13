import { AppError } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";

export function initMapEvent(services) {
    const mapService = services.mapService
    const navigation = services.navigationService

    const {
        centerButton,
        closestParkingButton,
        stopButton,
    } = UI.el.bottomBar;

    const {
        loader,
        searchBox,
        parkingListButton,
    } = UI.el.topBar;

    const {
        resultContainer,
        closeResultButton,
    } = UI.el.resultsPopup

    let tId = null;
    mapService.map.addListener('dragstart', () => {
        if (navigation.followingRoute) {
            if (tId) clearTimeout(tId);
            navigation.pauseFollowRoute();
            mapService.map.addListener('dragend', () => {
                tId = setTimeout(() => {
                    navigation.startFollowRoute();
                    tId = null;
                }, 3000);
            })
        }
    });

    centerButton.addEventListener("click", async () => {
        if (Utils.isCoordObjectEqual(mapService.userMarker.position, mapService.defaultPosition)) {
            try {
                UI.notify("MAP", "Localisation...", false, 10);
                await services.geolocationService.locateUser();
                UI.notify("MAP", "Géolocalisation réussi !");
            } catch (err) {
                handleError(err, "Géolocalisation")
            }
        } else {
            UI.notify("MAP", "Map recentré !", false, 2);
        }
        mapService.setCenter();
    });

    //Rechercher le parking le plus proche
    closestParkingButton.addEventListener("click", (e) => {
        handleClosestButton(e);
    });

    //Rechercher parkings
    searchBox.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            handleSearchBoxSubmit(e);
        }
    });

    //Lister les parkings
    parkingListButton.addEventListener("click", async (e) => {
        handleParkingListButton(e);
    });

    resultContainer.addEventListener("click", (event) => {
        const infoButton = event.target.closest(".parking-info");
        const routeButton = event.target.closest(".parking-route");

        if (infoButton) {
            handleParkingInfoClick(event, infoButton);
            return;
        }

        if (routeButton) {
            handleParkingClick(event, routeButton);
        }
    });


    //Annuler ou stop
    if (stopButton) {
        stopButton.addEventListener("click", (e) => {
            handleCrossButton(e);
        });
    }

    //Fermer les box
    closeResultButton.addEventListener("click", (e) => {
        handleCloseButton(e);
    });

    async function handleNavigation(destination) {
        await navigation.startNavigation(destination);
        navigation.startPreview();
    }

    // Parking le plus proche
    async function handleClosestButton(event) {
        event.preventDefault();
        UI.show(loader);
        UI.setupNavigationUI("CHARGEMENT...");

        try {
            const closest = await navigation.closestParking();
            handleNavigation(closest.data);
        } catch (error) {
            UI.setupUI();
            handleError(error, "Navigation");
        } finally {
            UI.hide(loader);
        }
    }

    // Cliquer sur un parking dans la liste
    async function handleParkingClick(event, link) {
        event.preventDefault();
        UI.show(loader);
        UI.setupNavigationUI("CHARGEMENT...");

        try {
            const lat = parseFloat(link.dataset.lat);
            const lng = parseFloat(link.dataset.lng);
            const name = link.dataset.name;
            const id = link.dataset.id;

            if (!id || isNaN(lat) || isNaN(lng) || !name) {
                throw new AppError("Données invalides");
            }

            const destination = { id, lat, lng, name };
            handleNavigation(destination);
        } catch (error) {
            handleError(error, "Navigation")
        } finally {
            UI.hide(loader);
        }
    }

    // Soumission de la recherche
    async function handleSearchBoxSubmit(event) {
        event.preventDefault();
        const query = UI.getSearchQuery().trim();

        if (!query) {
            UI.hide(resultContainer);
            return;
        }
        UI.show(loader);
        try {
            const result = await services.apiService.phpFetch("parking/search", { search: query });
            UI.setResultTitle("Résultats");
            handleParkingList(result.data);
        } catch (error) {
            if (error?.code === "NOT_FOUND") {
                UI.setResultTitle("Aucun résultat");
                UI.setResultMessage(":(");
                UI.show(resultContainer);
                return;
            }
            handleError(error, "Parkings")
        } finally {
            UI.hide(loader);
        }
    }

    // Liste de tous les parkings
    async function handleParkingListButton(event) {
        event.preventDefault();
        UI.show(loader);
        UI.emptySearchBox();

        try {
            const result = await services.apiService.phpFetch("parking/search", {});
            UI.setResultTitle("Tous les Parkings");
            handleParkingList(result.data);
        } catch (error) {
            handleError(error, "Parkings")
        } finally {
            UI.hide(loader);
        }

    }

    // Détails d’un parking
    async function handleParkingInfoClick(event, button) {
        event.preventDefault();
        UI.hide(resultContainer);
        UI.show(loader);

        try {
            UI.emptyResultBox();
            UI.emptySearchBox();

            const id = button.dataset.id;
            const result = await services.apiService.phpFetch("parking/load", { id });
            const parking = result.data;

            UI.setResultTitle(parking.nom);
            displayParkingInfo(parking);
        } catch (error) {
            handleError(error, "Informations")
        } finally {
            UI.hide(loader);
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
        UI.show(resultContainer);
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

                const infoButton = document.createElement("button");
                infoButton.className = "littleButton button fade parking-info";
                infoButton.title = "Cliquez pour voir les informations";
                infoButton.dataset.id = parking.id;

                const icon = document.createElement("i");
                icon.className = "fa fa-info";
                icon.textContent = "INFO";
                infoButton.appendChild(icon);

                const routeLink = document.createElement("button");
                routeLink.className = "item parking fade parking-route";
                routeLink.textContent =
                    parking.nom +
                    (parking.places_libres > 0
                        ? ` | ${parking.places_libres} places libres`
                        : parking.places_libres == -1
                            ? ""
                            : " | complet");

                routeLink.dataset.lat = parking.lat;
                routeLink.dataset.lng = parking.lng;
                routeLink.dataset.id = parking.id;
                routeLink.dataset.name = parking.nom;

                container.appendChild(infoButton);
                container.appendChild(routeLink);
                UI.appendResultBox(container);
            });
        }

        UI.show(resultContainer);
    }



    // Fermer les resultbox
    function handleCloseButton(event) {
        event.preventDefault();
        UI.hide(resultContainer);

        if (navigation.route) {
            navigation.stopNavigation();
            mapService.setZoom();
            mapService.setCenter();
        }
    }

    async function handleCrossButton(event) {
        event.preventDefault();

        navigation.stopNavigation();
        UI.setupUI();
        UI.emptySearchBox();

        mapService.setZoom();
        mapService.setCenter();
    }
}