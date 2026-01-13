import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";
import { ERROR_MESSAGES } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";

export function initUserEvent(services) {
    const userService = services.userService;
    const {
        authContainer,
        submitAuthButton,
        signInLink,
        logInLink,
        closeAuthButton,
        errorTextAuth,
        mailInput,
        nameInput,
        surnameInput,
        telInput,
        passwordInput,
        confirmPasswordInput,
    } = UI.el.authPopup

    const {
        logoutButton,
        settingContainer
    } = UI.el.settingsPopup

    document.querySelectorAll(".submitInfo").forEach(el => {
        el.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                submitAuthButton.click();
            }
        });
    });

    logoutButton.addEventListener("click", async (e) => {
        try {
            await userService.logout();
            UI.hide(settingContainer);
            UI.toggleAuthIcon(false);
            UI.notify("Compte", "Déconnexion réussi !")
        } catch (error) {
            handleError(e, "Compte");
        }
    })

    submitAuthButton.addEventListener("click", (e) => {
        handleSubmit(e);
    })

    closeAuthButton.addEventListener("click", (e) => {
        UI.hide(UI.el.auth);
    })

    if (signInLink) {
        signInLink.addEventListener("click", () => {
            UI.toggleInsc(true);
        })
    }

    if (logInLink) {
        logInLink.addEventListener("click", () => {
            UI.toggleInsc(false);
        })
    }

    async function handleSubmit(event) {
        const { isEmpty, isValidEmail, isValidPhone, isValidString } = Utils
        userService.createAccount = false;
        event.preventDefault();

        let errors = [];

        errorTextAuth.textContent = "";
        UI.hide(errorTextAuth);

        if (isEmpty(mailInput.value))
            errors.push("L’email est obligatoire.");
        else if (!isValidEmail(mailInput.value))
            errors.push("Email invalide.");

        if (isEmpty(passwordInput.value))
            errors.push("Le mot de passe est obligatoire.");
        else if (passwordInput.value.length < 8)
            errors.push("Le mot de passe doit contenir au moins 8 caractères.");

        if (!confirmPasswordInput.classList.contains("hidden")) {
            userService.createAccount = true;

            if (isEmpty(confirmPasswordInput.value))
                errors.push("La confirmation du mot de passe est obligatoire.");
            else if (passwordInput.value !== confirmPasswordInput.value)
                errors.push("Les mots de passe ne correspondent pas.");
            if (isEmpty(nameInput.value))
                errors.push("Le prénom est obligatoire.");
            else if (!isValidString(nameInput.value))
                errors.push("Nom invalide !")
            if (isEmpty(surnameInput.value))
                errors.push("Le nom est obligatoire.");
            else if (!isValidString(surnameInput.value))
                errors.push("Prénom invalide !")
            if (isEmpty(telInput.value))
                errors.push("Le téléphone est obligatoire.");
            else if (!isValidPhone(telInput.value))
                errors.push("Le téléphone doit contenir uniquement des chiffres (8 à 15).");
        }

        if (errors.length > 0) {
            userService.createAccount = false;
            errorTextAuth.textContent = errors.join("\n");
            UI.show(errorTextAuth);
            return;
        }

        let userData = {
            name: nameInput.value,
            surname: surnameInput.value,
            tel: telInput.value,
            mail: mailInput.value,
            password: passwordInput.value,
        };

        try {
            await userService.auth(userData);
            UI.switchToLoggedIcon();
            UI.hide(authContainer);
            UI.notify("Compte", "Connexion réussi !");
        } catch (error) {
            console.error(error);
            errorTextAuth.textContent =
                ERROR_MESSAGES[error.code] ??
                ERROR_MESSAGES["DEFAULT"]

            UI.show(errorTextAuth);
        }
    }
}