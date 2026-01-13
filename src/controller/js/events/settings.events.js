import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { ERROR_MESSAGES } from "../errors/errors.js";

export function initSettingsEvent(services) {
    const {
        user,
        userService,
        vehiculeService,
    } = services;

    const {
        submitSettingsButton,
        closeSettingsButton,
        settingsContainer,
        settingsNameInput,
        settingsSurnameInput,
        settingsTelInput,
        settingsMailInput,
        maxDistanceInput,
        maxHourlyBudgetInput,
        pmrParkCheck,
        coveredParkCheck,
        freeParkingCheck,
        settingsVehiculesList,
        errorTextSettings,
    } = UI.el.settingsPopup;


    submitSettingsButton.addEventListener("click", handleUpdate);
    UI.el.bottomBar.settingsButton.addEventListener("click", handleSettingsButton);
    closeSettingsButton.addEventListener("click", () => UI.hide(settingsContainer));

    function showSettingsError(message) {
        errorTextSettings.textContent = message;
        UI.show(errorTextSettings);
    }

    function clearSettingsError() {
        errorTextSettings.textContent = "";
        UI.hide(errorTextSettings);
    }

    function isLoggedOrAuth() {
        if (!user.isLogged) {
            UI.show(UI.el.authPopup.authContainer);
            return false;
        }
        return true;
    }


    async function handleSettingsButton(event) {
        event.preventDefault();
        if (!isLoggedOrAuth()) return;

        await loadSettings();
        UI.show(settingsContainer);
    }

    async function loadSettings() {
        clearSettingsError();
        UI.resetCarSettList();

        let userData;

        try {
            userData = await userService.load();
        } catch (error) {
            handleError(error, "Paramètres");
            UI.hide(settingsContainer);
            return;
        }

        await loadVehicules();
        fillUserForm(userData.data);
    }

    async function loadVehicules() {
        try {
            const vehData = await vehiculeService.load();
            vehData.data?.forEach(addVehiculeOption);
        } catch (error) {
            if (error.code !== "NOT_FOUND") {
                handleError(error, "Paramètres");
                UI.hide(settingsContainer);
            }
        }
    }

    function addVehiculeOption(veh) {
        const isSelected =
            vehiculeService.selectedVehicule?.vehId == veh.id;

        settingsVehiculesList.add(
            new Option(veh.plate, veh.id, isSelected, isSelected)
        );
    }

    function fillUserForm(data) {
        settingsNameInput.value = data.name;
        settingsSurnameInput.value = data.surname;
        settingsMailInput.value = user.mail;
        settingsTelInput.value = data.tel;

        pmrParkCheck.checked = !!data.pmr;
        coveredParkCheck.checked = !!data.covered;
        freeParkingCheck.checked = !!data.free;

        maxDistanceInput.value = data.maxDistance;
        maxHourlyBudgetInput.value = data.maxHourly;
    }

    /* =========================
       UPDATE SETTINGS
    ========================== */

    async function handleUpdate(event) {
        event.preventDefault();
        clearSettingsError();

        const errors = validateForm();
        if (errors.length) {
            showSettingsError(errors.join("\n"));
            return;
        }

        const payload = buildData();

        try {
            await userService.update(payload);
            vehiculeService.addToStorage({ vehId: settingsVehiculesList.value });

            UI.notify("Compte", "Paramètres mis à jour avec succès");
            UI.hide(settingsContainer);
        } catch (error) {
            showSettingsError(
                ERROR_MESSAGES[error.code] ?? ERROR_MESSAGES.DEFAULT
            );
        }
    }

    function validateForm() {
        const {
            isEmpty,
            isValidPhone,
            isValidString,
            isValidNumber,
        } = Utils;

        const errors = [];

        if (isEmpty(settingsNameInput.value))
            errors.push("Le prénom est obligatoire.");
        else if (!isValidString(settingsNameInput.value))
            errors.push("Prénom invalide.");

        if (isEmpty(settingsSurnameInput.value))
            errors.push("Le nom est obligatoire.");
        else if (!isValidString(settingsSurnameInput.value))
            errors.push("Nom invalide.");

        if (isEmpty(settingsTelInput.value))
            errors.push("Le téléphone est obligatoire.");
        else if (!isValidPhone(settingsTelInput.value))
            errors.push("Le téléphone doit contenir uniquement des chiffres (8 à 15).");

        if (isEmpty(maxDistanceInput.value))
            errors.push("La distance maximale est obligatoire.");
        else if (!isValidNumber(maxDistanceInput.value))
            errors.push("La distance maximale doit être un nombre positif.");

        if (isEmpty(maxHourlyBudgetInput.value))
            errors.push("Le budget maximal par heure est obligatoire.");
        else if (!isValidNumber(maxHourlyBudgetInput.value))
            errors.push("Le budget maximal par heure doit être un nombre positif.");

        return errors;
    }

    function buildData() {
        return {
            id: user.userId,
            name: settingsNameInput.value.trim(),
            surname: settingsSurnameInput.value.trim(),
            tel: settingsTelInput.value.trim(),
            free: freeParkingCheck.checked,
            pmr: pmrParkCheck.checked,
            covered: coveredParkCheck.checked,
            maxHourly: Number(maxHourlyBudgetInput.value) || 0,
            maxDist: Number(maxDistanceInput.value) || 0,
        };
    }
}
