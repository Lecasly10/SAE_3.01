import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { ERROR_MESSAGES } from "../errors/errors.js";

export function initSettingsEvent(services) {
    const user = services.user;
    const userService = services.userService;
    const vehiculeService = services.vehiculeService;
    const { submitSettingsButton, closeSettingsButton,
        settingsContainer, settingsNameInput, settingsSurnameInput,
        settingsTelInput, settingsMailInput,
        maxDistanceInput, maxHourlyBudgetInput,
        pmrParkCheck, coveredParkCheck, freeParkingCheck,
        settingsVehiculesList, errorTextSettings
    } = UI.el.settingsPopup;

    submitSettingsButton.addEventListener("click", async (e) => {
        handleUpdate(e);
    })

    UI.el.bottomBar.settingsButton.addEventListener("click", (e) => {
        handleSettingButton(e);
    });

    closeSettingsButton.addEventListener("click", (e) => {
        UI.hide(settingsContainer);
    });

    function handleSettingButton(event) {
        event.preventDefault();
        if (user.isLogged) {
            handleSettings();
            UI.show(settingsContainer);
        } else {
            UI.show(UI.el.authPopup.authContainer);
        }
    }

    async function handleSettings() {
        let userData;
        let vehData;

        try {
            userData = await userService.load();
        } catch (error) {
            handleError(error, "Paramètres");
            UI.hide(settingsContainer);
            return;
        }

        UI.resetCarSettList();
        try {
            vehData = await vehiculeService.load();

            if (vehData.data?.length > 0) {
                vehData.data.forEach(veh => {
                    if (vehiculeService.selectedVehicule && vehiculeService.selectedVehicule.vehId == veh.id)
                        settingsVehiculesList.add(new Option(`${veh.plate}`, veh.id, true, true))
                    else
                        settingsVehiculesList.add(new Option(`${veh.plate}`, veh.id))
                });
            }
        } catch (error) {
            if (error.code !== "NOT_FOUND") {
                handleError(error, "Paramètres");
                UI.hide(UI.el.settings)
                return;
            }
        }

        settingsNameInput.value = userData.data.name;
        settingsSurnameInput.value = userData.data.surname;
        settingsMailInput.value = user.mail;
        settingsTelInput.value = userData.data.tel;
        pmrParkCheck.checked = userData.data.pmr == true;
        coveredParkCheck.checked = userData.data.covered == true;
        freeParkingCheck.checked = userData.data.free == true;
        maxDistanceInput.value = userData.data.maxDistance;
        maxHourlyBudgetInput.value = userData.data.maxHourly;

    }

    async function handleUpdate(e) {
        e.preventDefault()
        const { isEmpty, isValidPhone, isValidString, isValidNumber } = Utils
        let errors = [];

        errorTextSettings.textContent = "";
        UI.hide(errorTextSettings);

        if (isEmpty(settingsNameInput.value))
            errors.push("Le prénom est obligatoire.");
        else if (!isValidString(settingsNameInput.value))
            errors.push("Prénom invalide !");
        if (isEmpty(settingsSurnameInput.value))
            errors.push("Le nom est obligatoire.");
        else if (!isValidString(settingsSurnameInput.value))
            errors.push("nom invalide !");
        if (isEmpty(settingsTelInput.value))
            errors.push("Le téléphone est obligatoire.");
        else if (!isValidPhone(settingsTelInput.value))
            errors.push("Le téléphone doit contenir uniquement des chiffres (8 à 15).");
        if (isEmpty(maxDistanceInput.value))
            errors.push("La distance maximal est obligatoire");
        else if (!isValidNumber(maxDistanceInput.value))
            errors.push("La distance maximal doit etre un nombre positif");
        if (isEmpty(maxHourlyBudgetInput.value))
            errors.push("Le budget maximal par heure est obligatoire");
        else if (!isValidNumber(maxHourlyBudgetInput.value))
            errors.push("Le budget maximal par heure doit etre un nombre positif");


        if (errors.length > 0) {
            errorTextSettings.textContent = errors.join("\n");
            UI.show(errorTextSettings);
            return;
        }

        const formData = {
            id: user.userId,
            name: settingsNameInput.value,
            surname: settingsSurnameInput.value,
            tel: settingsTelInput.value,
            free: freeParkingCheck.checked,
            pmr: pmrParkCheck.checked,
            covered: coveredParkCheck.checked,
            maxHourly: maxHourlyBudgetInput.value ? maxHourlyBudgetInput.value : 0,
            maxDist: maxDistanceInput.value ? maxDistanceInput.value : 0,
        };

        try {
            await userService.update(formData);
            UI.notify("Compte", "Paramètres mise à jour avec succès");
            UI.hide(settingsContainer);

            vehiculeService.addToStorage({ vehId: settingsVehiculesList.value })
        } catch (error) {
            console.error(error);
            errorTextSettings.textContent =
                ERROR_MESSAGES[error.code] ??
                ERROR_MESSAGES["DEFAULT"]

            UI.show(errorTextSettings);
        }

    }
}