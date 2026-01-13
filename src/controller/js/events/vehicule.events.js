import { ERROR_MESSAGES } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";

export function initVehiculeEvent(services) {
    const { user, vehiculeService } = services;

    const { settingsButton } = UI.el.bottomBar;

    const {
        vehiculeList,
        vehiculeContainer,
        editVehiculeButton,
        addVehiculeButton,
        deleteVehiculeButton,
        closeVehiculeButton,
    } = UI.el.vehiculePopup;

    const {
        vehiculeEditContainer,
        vehiculeEditContainerTitle,
        submitVehiculeButton,
        closeVehiculeEditButton,
        vehiculePlateInput,
        vehiculeHeightInput,
        vehiculeMotorInput,
        vehiculeTypeInput,
        errorTextVehicule,
    } = UI.el.vehiculeEditPopup;

    UI.el.settingsPopup.vehiculeButton.addEventListener("click", openVehicules);

    editVehiculeButton.addEventListener("click", () => openVehiculeEdit(false));
    addVehiculeButton.addEventListener("click", () => openVehiculeEdit(true));
    deleteVehiculeButton.addEventListener("click", deleteVehicule);

    submitVehiculeButton.addEventListener("click", submitVehicule);
    closeVehiculeButton.addEventListener("click", () => UI.hide(vehiculeContainer));
    closeVehiculeEditButton.addEventListener("click", () => UI.hide(vehiculeEditContainer));

    vehiculeList.addEventListener("change", updateActionButtons);

    function refreshSettings() {
        try {
            settingsButton.click();
            UI.el.settingsPopup.vehiculeButton.click();
        } catch (e) {
            handleError(e, "Véhicules");
        }
    }

    function getSelectedVehicule() {
        const id = vehiculeList.value;
        return id ?? null;
    }

    function clearVehiculeError() {
        errorTextVehicule.textContent = "";
        UI.hide(errorTextVehicule);
    }

    function showVehiculeError(message) {
        errorTextVehicule.textContent = message;
        UI.show(errorTextVehicule);
    }

    async function openVehicules(event) {
        event?.preventDefault();
        UI.resetCarEditList();

        try {
            const vehData = await vehiculeService.load();
            renderVehiculeList(vehData);
        } catch (error) {
            if (error?.code !== "NOT_FOUND") {
                handleError(error, "Véhicules");
            }
        }

        vehiculeList.value = "";
        updateActionButtons();
        UI.show(vehiculeContainer);
    }

    function renderVehiculeList(list) {
        vehiculeList.innerHTML = "";
        vehiculeList.add(new Option("-- Sélectionner --", ""));

        list.forEach((veh) => {
            vehiculeList.add(new Option(veh.plate, veh.id));
        });
    }

    function updateActionButtons() {
        const hasSelection = !!vehiculeList.value;
        editVehiculeButton.disabled = !hasSelection;
        deleteVehiculeButton.disabled = !hasSelection;
    }

    function openVehiculeEdit(isNew) {
        clearVehiculeError();

        if (isNew) {
            vehiculeEditContainerTitle.textContent = "NOUVEAU VÉHICULE";
            resetVehiculeForm();
        } else {
            const veh = getSelectedVehicule();
            if (!veh) return;

            vehiculeEditContainerTitle.textContent = "MODIFICATION";
            fillVehiculeForm(veh);
        }

        UI.show(vehiculeEditContainer);
    }

    function resetVehiculeForm() {
        vehiculePlateInput.value = "";
        vehiculeHeightInput.value = "";
        vehiculeMotorInput.value = "";
        vehiculeTypeInput.value = "";
    }

    function fillVehiculeForm(veh) {
        vehiculePlateInput.value = veh.plate;
        vehiculeHeightInput.value = veh.height;
        vehiculeMotorInput.value = veh.motor;
        vehiculeTypeInput.value = veh.type;
    }

    async function submitVehicule(event) {
        event.preventDefault();
        clearVehiculeError();

        const errors = validateVehiculeForm();
        if (errors.length) {
            showVehiculeError(errors.join("\n"));
            return;
        }

        const veh = getSelectedVehicule();
        const payload = buildVehiculeData(veh);

        try {
            if (veh) {
                await vehiculeService.updateVehicule(payload);
                UI.notify("Véhicules", "Véhicule mis à jour avec succès", true);
            } else {
                await vehiculeService.createVehicule(payload);
                UI.notify("Véhicules", "Véhicule créé avec succès", true);
            }

            UI.hide(vehiculeEditContainer);
            refreshSettings();
        } catch (error) {
            showVehiculeError(
                ERROR_MESSAGES[error.code] ?? ERROR_MESSAGES.DEFAULT
            );
        }
    }

    async function deleteVehicule(event) {
        event.preventDefault();
        const veh = getSelectedVehicule();
        if (!veh) return;

        if (!confirm("Voulez-vous vraiment supprimer ce véhicule ?")) return;

        try {
            await vehiculeService.deleteVehicule(veh.id);
            UI.notify("Véhicules", "Véhicule supprimé avec succès", true);
            refreshSettings();
        } catch (error) {
            handleError(error, "Véhicules");
        }
    }


    function validateVehiculeForm() {
        const { isEmpty, isValidPlate, isValidPositiveNumber } = Utils;
        const errors = [];

        if (isEmpty(vehiculePlateInput.value))
            errors.push("La plaque est obligatoire.");
        else if (!isValidPlate(vehiculePlateInput.value))
            errors.push("Format de plaque incorrect.");

        if (isEmpty(vehiculeHeightInput.value))
            errors.push("La hauteur du véhicule est obligatoire.");
        else if (!isValidPositiveNumber(vehiculeHeightInput.value))
            errors.push("La hauteur doit être un nombre positif.");

        if (isEmpty(vehiculeMotorInput.value))
            errors.push("Le type de moteur est obligatoire.");

        if (isEmpty(vehiculeTypeInput.value))
            errors.push("Le type de véhicule est obligatoire.");

        return errors;
    }


    function buildVehiculeData(veh) {
        return {
            id: veh?.id ?? user.userId,
            plate: vehiculePlateInput.value.trim(),
            height: Number(vehiculeHeightInput.value),
            motor: vehiculeMotorInput.value,
            type: vehiculeTypeInput.value,
        };
    }
}
