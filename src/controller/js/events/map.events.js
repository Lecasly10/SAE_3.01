import { AppError } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";

export function initMapEvent(services) {
    const { mapService, navigationService: navigation, geolocationService, apiService } = services;

    const { centerButton, closestParkingButton, stopButton } = UI.el.bottomBar;
    const { loader, searchBox, parkingListButton } = UI.el.topBar;
    const { resultContainer, closeResultButton } = UI.el.resultsPopup;


    let followTimeout = null;

    mapService.map.addListener("dragstart", () => {
        if (!navigation.followingRoute) return;

        if (followTimeout) clearTimeout(followTimeout);
        navigation.pauseFollowRoute();

        google.maps.event.addListenerOnce(mapService.map, "dragend", () => {
            followTimeout = setTimeout(() => {
                navigation.startFollowRoute();
                followTimeout = null;
            }, 3000);
        });
    });


    async function withLoader(fn, errorLabel) {
        try {
            UI.show(loader);
            await fn();
        } catch (err) {
            UI.setupUI();
            handleError(err, errorLabel);
        } finally {
            UI.hide(loader);
        }
    }

    async function startNavigation(destination) {
        await navigation.startNavigation(destination);
        navigation.startPreview();
    }

    function resetMap() {
        mapService.setZoom();
        mapService.setCenter();
    }


    centerButton.addEventListener("click", async () => {
        if (Utils.isCoordObjectEqual(mapService.userMarker.position, mapService.defaultPosition)) {
            try {
                UI.notify("MAP", "Localisation...", false, 10);
                await geolocationService.locateUser();
                UI.notify("MAP", "Géolocalisation réussie !");
            } catch (err) {
                handleError(err, "Géolocalisation");
            }
        } else {
            UI.notify("MAP", "Map recentrée !", false, 2);
        }
        mapService.setCenter();
    });

    closestParkingButton.addEventListener("click", (e) => {
        e.preventDefault();
        UI.setupNavigationUI("CHARGEMENT...");

        withLoader(async () => {
            const closest = await navigation.closestParking();
            await startNavigation(closest.data);
        }, "Navigation");
    });

    parkingListButton.addEventListener("click", (e) => {
        e.preventDefault();
        UI.emptySearchBox();

        withLoader(async () => {
            const result = await apiService.phpFetch("parking/search", {});
            UI.setResultTitle("Tous les Parkings");
            renderParkingList(result.data);
        }, "Parkings");
    });

    stopButton?.addEventListener("click", (e) => {
        e.preventDefault();
        navigation.stopNavigation();
        UI.setupUI();
        UI.emptySearchBox();
        resetMap();
    });

    closeResultButton.addEventListener("click", (e) => {
        e.preventDefault();
        UI.hide(resultContainer);

        if (navigation.route) {
            navigation.stopNavigation();
            resetMap();
        }
    });


    searchBox.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;

        e.preventDefault();
        UI.emptyResultBox();

        const query = UI.getSearchQuery().trim();
        if (!query) return UI.hide(resultContainer);

        withLoader(async () => {
            const result = await apiService.phpFetch("parking/search", { search: query });
            UI.setResultTitle("Résultats");
            renderParkingList(result.data);
        }, "Parkings");
    });


    resultContainer.addEventListener("click", (event) => {
        const infoBtn = event.target.closest(".parking-info");
        const routeBtn = event.target.closest(".parking-route");

        if (infoBtn) return loadParkingInfo(infoBtn.dataset.id);
        if (routeBtn) return navigateToParking(routeBtn);
    });


    async function navigateToParking(button) {
        const { lat, lng, id, name } = button.dataset;

        if (!id || !lat || !lng || !name) {
            return handleError(new AppError("Données invalides"), "Navigation");
        }

        UI.setupNavigationUI("CHARGEMENT...");

        withLoader(async () => {
            await startNavigation({
                id,
                name,
                lat: Number(lat),
                lng: Number(lng),
            });
        }, "Navigation");
    }

    async function loadParkingInfo(id) {
        UI.hide(resultContainer);

        withLoader(async () => {
            UI.emptyResultBox();
            UI.emptySearchBox();

            const result = await apiService.phpFetch("parking/load", { id });
            displayParkingInfo(result.data);
        }, "Informations");
    }

    function renderParkingList(parkings = []) {
        UI.emptyResultBox();

        if (!parkings.length) {
            UI.setResultTitle("Aucun résultat");
            UI.setResultMessage(":(");
        } else {
            parkings.forEach((parking) => {
                const container = document.createElement("div");
                container.className = "resultDiv";

                const infoBtn = document.createElement("button");
                infoBtn.className = "item parking-info";
                infoBtn.dataset.id = parking.id;
                infoBtn.innerHTML = `<i class="fa fa-info">INFO</i>`;

                const routeBtn = document.createElement("button");
                routeBtn.className = "item parking parking-route";
                routeBtn.dataset = {
                    id: parking.id,
                    lat: parking.lat,
                    lng: parking.lng,
                    name: parking.nom,
                };

                routeBtn.textContent =
                    parking.nom +
                    (parking.places_libres > 0
                        ? ` | ${parking.places_libres} places libres`
                        : parking.places_libres === -1
                            ? ""
                            : " | complet");

                container.append(infoBtn, routeBtn);
                UI.appendResultBox(container);
            });
        }

        UI.show(resultContainer);
    }

    function displayParkingInfo(parking) {
        UI.setResultTitle(parking.nom);

        const sections = [
            [
                ["Adresse", parking.address],
                ["Coordonnées", `${parking.lat} - ${parking.lng}`],
                ["Type", parking.structure],
                ["Places", parking.places_libres > 0 ? `${parking.places_libres}/${parking.places}` : parking.places],
                ["Gratuit", parking.free ? "Oui" : "Non"],
            ],
            [
                ["PMR", parking.pmr],
                ["Moto", parking.moto],
                ["Voiture électrique", parking.eCar],
            ],
        ];

        sections.forEach((list) => {
            const div = document.createElement("div");
            UI.appendTextElements(div, list);
            UI.appendResultBox(div);
        });

        const info = document.createElement("p");
        info.className = "text";
        info.textContent = parking.info || "Aucune information supplémentaire.";
        UI.appendResultBox(info);

        UI.show(resultContainer);
    }
}
