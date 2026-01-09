import { AppError, ERROR_MESSAGES } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";

export function initVehiculeEvent(services) {
    const user = services.user
    const vehiculeService = services.vehiculeService;
    const { carButton, editCar, addCar, deleteCar,
        submitEditCar, listvoit, closeVoit, closeEdit } = UI.el

    carButton.addEventListener("click", async (e) => {
        handleCar(e);
        UI.show(UI.el.voitureDiv);
    })

    editCar.addEventListener("click", async (e) => {
        handleCarEdit(e);
        UI.toggleVoitureEdit(true);
    })

    addCar.addEventListener("click", async (e) => {
        handleCarEdit(e);
        UI.toggleVoitureEdit(true);
    })

    deleteCar.addEventListener("click", async (e) => {
        handleDeleteCar(e);
    })

    submitEditCar.addEventListener("click", async (e) => {
        await handleCarEditSubmit(e);
    })

    listvoit.addEventListener("change", (e) => {
        e.preventDefault();
        deleteCar.disabled = listvoit.value === "none";
        editCar.disabled = listvoit.value === "none";
    });

    closeVoit.addEventListener("click", async () => {
        UI.hide(UI.el.voitureDiv);
    })

    closeEdit.addEventListener("click", async () => {
        UI.toggleVoitureEdit(false);
    })

    function update() {
        const { settingsButton } = UI.el
        try {
            settingsButton.click();
            carButton.click();
        } catch (e) {
            handleError(e);
        }

    }

    async function handleCar(event) {
        event.preventDefault();
        UI.resetCarEditList();

        try {
            let vehData = await vehiculeService.load();
            vehData.data.forEach(veh => {
                listvoit.add(new Option(`${veh.plate}`, JSON.stringify(veh)));
            });
        } catch (error) {
            handleError(error, "Véhicules");
        }

        listvoit.value = "none";
    }

    function handleCarEdit(event) {
        event.preventDefault()
        const { plateParam, vHeightParam,
            vMotorParam, vTypeParam, editTitle } = UI.el;

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
            } catch (error) {
                handleError(error, "Véhicules")
            }
        }

    }

    async function handleCarEditSubmit(event) {
        event.preventDefault();
        const { plateParam, vHeightParam, vMotorParam, vTypeParam, errorV } = UI.el;
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

        let msg;

        try {
            if (listvoit.value === "none" || listvoit.value === "") {
                msg = "Véhicule créé avec succès"
                await vehiculeService.createVehicule(info);

            } else {
                msg = "Véhicule mise à jour avec succès"
                await vehiculeService.updateVehicule(info);
            }
            update();
            UI.notify("Véhicules", msg, true)
            UI.toggleVoitureEdit(false);
        } catch (error) {
            errorV.textContent = ERROR_MESSAGES[error.code]
                ?? ERROR_MESSAGES.DEFAULT;
            UI.show(errorV);
            console.error(error)
        }

    }

    async function handleDeleteCar(event) {
        event.preventDefault();

        if (listvoit.value === "none" || listvoit === "") return;

        try {
            let id = JSON.parse(listvoit.value).id;

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