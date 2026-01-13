import { ERROR_MESSAGES } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";

export function initVehiculeEvent(services) {
    const user = services.user
    const vehiculeService = services.vehiculeService;

    const { settingsButton } = UI.el.bottomBar

    const { vehiculeList, vehiculeContainer,
        editVehiculeButton, addVehiculeButton,
        deleteVehiculeButton, closeVehiculeButton
    } = UI.el.vehiculePopup;

    const {
        vehiculeEditContainer, vehiculeEditContainerTitle,
        submitVehiculeButton, closeVehiculeEditButton,
        vehiculePlateInput, vehiculeHeightInput,
        vehiculeMotorInput, vehiculeTypeInput, errorTextVehicule
    } = UI.el.vehiculeEditPopup;

    UI.el.settingsPopup.vehiculeButton.addEventListener("click", async (e) => {
        handleCar(e);
        UI.show(vehiculeContainer);
    })

    editVehiculeButton.addEventListener("click", async (e) => {
        handleCarEdit(e);
        UI.show(vehiculeEditContainer);
    })

    addVehiculeButton.addEventListener("click", async (e) => {
        handleCarEdit(e);
        UI.show(vehiculeEditContainer);
    })

    deleteVehiculeButton.addEventListener("click", async (e) => {
        handleDeleteCar(e);
    })

    submitVehiculeButton.addEventListener("click", async (e) => {
        await handleCarEditSubmit(e);
    })

    vehiculeList.addEventListener("change", (e) => {
        e.preventDefault();
        deleteVehiculeButton.disabled = vehiculeList.value === "none" || vehiculeList.value === "";
        editVehiculeButton.disabled = vehiculeList.value === "none" || vehiculeList.value === "";
    });

    closeVehiculeButton.addEventListener("click", async () => {
        UI.hide(vehiculeContainer);
    })

    closeVehiculeEditButton.addEventListener("click", async () => {
        UI.hide(UI.el.vehiculeEditPopup.vehiculeEditContainer);
    })

    function update() {
        try {
            settingsButton.click();
            carButton.click();
        } catch (e) {
            handleError(e, "Véhicules");
        }

    }

    async function handleCar(event) {
        event.preventDefault();
        UI.resetCarEditList();

        try {
            let vehData = await vehiculeService.load();
            vehData.data.forEach(veh => {
                vehiculeList.add(new Option(`${veh.plate}`, JSON.stringify(veh)));
            });
        } catch (error) {
            if (error?.code !== "NOT_FOUND")
                handleError(error, "Véhicules");
        }

        vehiculeList.value = "none";
    }

    function handleCarEdit(event) {
        event.preventDefault();

        let b = event.target.value;
        if (b == "new") {
            vehiculeList.value = "none"
            vehiculeEditContainerTitle.textContent = "NOUVEAU"
            vehiculePlateInput.value = "";
            vehiculeHeightInput.value = "";
        } else {
            try {
                let data = JSON.parse(UI.el.vehiculePopup.vehiculeList.value)
                vehiculeEditContainerTitle.textContent = "MODIFICATION"
                vehiculePlateInput.value = data.plate;
                vehiculeHeightInput.value = data.height;
                vehiculeMotorInput.value = data.motor;
                vehiculeTypeInput.value = data.type;
            } catch (error) {
                handleError(error, "Véhicules")
            }
        }

    }

    async function handleCarEditSubmit(event) {
        event.preventDefault();
        const { isEmpty, isValidPlate, isValidPositiveNumber } = Utils

        let id;
        let errors = [];
        if (vehiculeList.value === "none" || vehiculeList.value === "") id = user.userId;
        else id = JSON.parse(vehiculeList.value).id;

        errorTextVehicule.textContent = "";
        UI.hide(errorTextVehicule);

        if (isEmpty(vehiculePlateInput.value))
            errors.push("La plaque est obligatoire");
        else if (!isValidPlate(vehiculePlateInput.value))
            errors.push("Format de plaque incorrect");
        if (isEmpty(vehiculeHeightInput.value))
            errors.push("La hauteur du véhicule est obligatoire");
        else if (!isValidPositiveNumber(vehiculeHeightInput.value))
            errors.push("La hauteur du véhicule doit être un nombre entier positif non nul");
        if (isEmpty(vehiculeMotorInput.value))
            errors.push("Le type du moteur est obligatoire");
        if (isEmpty(vehiculeTypeInput.value))
            errors.push("Le type du véhicule est obligatoire");


        if (errors.length > 0) {
            errorTextVehicule.textContent = errors.join("\n");
            UI.show(errorTextVehicule);
            return;
        }
        errorTextVehicule.textContent = "";

        const info = {
            id: id,
            plate: vehiculePlateInput.value,
            height: vehiculeHeightInput.value,
            type: vehiculeTypeInput.value,
            motor: vehiculeMotorInput.value
        }

        let msg;

        try {
            if (vehiculeList.value === "none" || vehiculeList.value === "") {
                msg = "Véhicule créé avec succès"
                await vehiculeService.createVehicule(info);

            } else {
                msg = "Véhicule mis à jour avec succès"
                await vehiculeService.updateVehicule(info);
            }
            update();
            UI.notify("Véhicules", msg, true)
            UI.hide(vehiculeEditContainer);
        } catch (error) {
            errorTextVehicule.textContent = ERROR_MESSAGES[error.code]
                ?? ERROR_MESSAGES.DEFAULT;
            UI.show(errorTextVehicule);
            console.error(error)
        }

    }

    async function handleDeleteCar(event) {
        event.preventDefault();

        if (vehiculeList.value === "none" || vehiculeList.value === "") return;

        try {
            let id = JSON.parse(vehiculeList.value).id;

            if (confirm("Voulez vraiment supprimer ce véhicule")) {
                await vehiculeService.deleteVehicule(id);
                UI.notify("Véhicules", "Véhicule supprimé avec succès !", true)
                update();
            }
        } catch (error) {
            handleError(error, "Véhicule");
        }

    }
}