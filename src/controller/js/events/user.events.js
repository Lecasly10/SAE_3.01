import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";
import { ERROR_MESSAGES } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";

export function initUserEvent(services) {
    const userService = services.userService;
    const { logoutButton, submitButton, connLink,
        inscrLink, closeAuthButton, settings } = UI.el

    document.querySelectorAll(".submitInfo").forEach(el => {
        el.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                submitButton.click();
            }
        });
    });

    logoutButton.addEventListener("click", async (e) => {
        try {
            await userService.logout();
            UI.hide(settings);
            UI.toggleAuthIcon(false);
            UI.notify("Compte", "Déconnexion réussi !")
        } catch (error) {
            handleError(e, "Compte");
        }
    })

    submitButton.addEventListener("click", (e) => {
        handleSubmit(e);
    })

    closeAuthButton.addEventListener("click", (e) => {
        UI.hide(UI.el.auth);
    })

    if (inscrLink) {
        inscrLink.addEventListener("click", () => {
            UI.toggleInsc(true);
        })
    }

    if (connLink) {
        connLink.addEventListener("click", () => {
            UI.toggleInsc(false);
        })
    }

    async function handleSubmit(event) {
        const { isEmpty, isValidEmail, isValidPhone, isValidString } = Utils
        userService.createAccount = false;
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
            userService.createAccount = true;

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
            userService.createAccount = false;
            errorI.textContent = errors.join("\n");
            UI.show(errorI);
            return;
        }

        let userData = {
            name: nameI.value,
            surname: surnameI.value,
            tel: telI.value,
            mail: mail.value,
            password: pass.value,
        };

        try {
            await userService.auth(userData);
            UI.toggleAuthIcon(true);
            UI.hide(auth);
            UI.notify("Compte", "Connexion réussi !")
        } catch (error) {
            console.error(error);
            errorI.textContent =
                ERROR_MESSAGES[error.code] ??
                ERROR_MESSAGES["DEFAULT"]

            UI.show(errorI);
        }
    }
}