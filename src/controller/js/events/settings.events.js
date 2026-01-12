import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";
import { handleError } from "../errors/globalErrorHandling.js";

export function initSettingsEvent(services) {
    const user = services.user;
    const userService = services.userService;
    const vehiculeService = services.vehiculeService;
    const { submitSett, settingsButton, closeSettingButton } = UI.el;

    submitSett.addEventListener("click", async (e) => {
        handleUpdate(e)
    })

    settingsButton.addEventListener("click", (e) => {
        handleSettingButton(e);
    });

    closeSettingButton.addEventListener("click", (e) => {
        UI.hide(UI.el.settings);
    });

    function handleSettingButton(event) {
        event.preventDefault();
        if (user.isLogged) {
            handleSettings();
            UI.show(UI.el.settings);
        } else {
            UI.toggleAuth(true);
        }
    }

    async function handleSettings() {
        const {
            nameParam, mailParam, telParam,
            surnameParam, maxDistParam, maxHBudgetParam,
            pmrParam, coverParam, freeParam, carParam } = UI.el;

        let userData;
        let vehData;

        try {
            userData = await userService.load();
        } catch (error) {
            handleError(error, "Paramètres");
            UI.hide(UI.el.settings);
            return;
        }

        try {
            vehData = await vehiculeService.load();
        } catch (error) {
            if (error.code !== "NOT_FOUND") {
                handleError(error, "Paramètres");
                UI.hide(UI.el.settings)
                return;
            }
        }

        UI.resetCarSettList();
        nameParam.value = userData.data.name;
        surnameParam.value = userData.data.surname;
        mailParam.value = user.mail;
        telParam.value = userData.data.tel;
        pmrParam.checked = userData.data.pmr == true;
        coverParam.checked = userData.data.covered == true;
        freeParam.checked = userData.data.free == true;
        maxDistParam.value = userData.data.maxDistance;
        maxHBudgetParam.value = userData.data.maxHourly;

        if (vehData.data.length > 0) {
            vehData.data.forEach(veh => {
                if (vehiculeService.selectedVehicule && vehiculeService.selectedVehicule.vehId == veh.id)
                    carParam.add(new Option(`${veh.plate}`, veh.id, true, true))
                else
                    carParam.add(new Option(`${veh.plate}`, veh.id))
            });
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

        const formData = {
            id: user.userId,
            name: nameParam.value,
            surname: surnameParam.value,
            tel: telParam.value,
            free: freeParam.checked,
            pmr: pmrParam.checked,
            covered: coverParam.checked,
            maxHourly: maxHBudgetParam.value ? maxHBudgetParam.value : 0,
            maxDist: maxDistParam.value ? maxDistParam.value : 0,
        };

        try {
            await userService.update(formData);
            UI.notify("Compte", "Paramètres mise à jour avec succès");
            UI.hide(UI.el.settings);

            vehiculeService.addToStorage({ vehId: carParam.value })

        } catch (error) {
            handleError(e, "Paramètres");
        }

    }
}