import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";
import { ERROR_MESSAGES } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";

export function initUserEvent(services) {
    const { userService } = services;

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
    } = UI.el.authPopup;

    const {
        logoutButton,
        settingsContainer,
    } = UI.el.settingsPopup;

    bindSubmitOnEnter();
    submitAuthButton.addEventListener("click", handleSubmit);
    closeAuthButton.addEventListener("click", () => UI.hide(authContainer));

    logoutButton.addEventListener("click", handleLogout);

    signInLink.addEventListener("click", UI.switchToLogin());
    logInLink.addEventListener("click", UI.switchToSigin());


    function bindSubmitOnEnter() {
        document.querySelectorAll(".submitInfo").forEach((el) => {
            el.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    submitAuthButton.click();
                }
            });
        });
    }

    function showAuthError(message) {
        errorTextAuth.textContent = message;
        UI.show(errorTextAuth);
    }

    function clearAuthError() {
        errorTextAuth.textContent = "";
        UI.hide(errorTextAuth);
    }

    function isSignup() {
        return !confirmPasswordInput.classList.contains("hidden");
    }

    async function handleLogout(event) {
        event.preventDefault();

        try {
            await userService.logout();
            UI.hide(settingsContainer);
            UI.switchToLoginIcon();
            UI.notify("Compte", "Déconnexion réussie !");
        } catch (error) {
            UI.hide(settingsContainer);
            handleError(error, "Compte");
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        clearAuthError();

        const signup = isSignup();
        const errors = validateForm(signup);

        if (errors.length) {
            showAuthError(errors.join("\n"));
            return;
        }

        const payload = buildData(signup);
        userService.createAccount = signup;

        try {
            await userService.auth(payload);
            UI.switchToLoggedIcon();
            UI.hide(authContainer);
            UI.notify("Compte", signup ? "Compte créé avec succès !" : "Connexion réussie !");
        } catch (error) {
            showAuthError(
                ERROR_MESSAGES[error.code] ?? ERROR_MESSAGES.DEFAULT
            );
        } finally {
            userService.createAccount = false;
        }
    }

    function validateForm(signup) {
        const {
            isEmpty,
            isValidEmail,
            isValidPhone,
            isValidString,
        } = Utils;

        const errors = [];

        if (isEmpty(mailInput.value))
            errors.push("L’email est obligatoire.");
        else if (!isValidEmail(mailInput.value))
            errors.push("Email invalide.");

        if (isEmpty(passwordInput.value))
            errors.push("Le mot de passe est obligatoire.");
        else if (passwordInput.value.length < 8)
            errors.push("Le mot de passe doit contenir au moins 8 caractères.");

        if (!signup) return errors;

        if (isEmpty(confirmPasswordInput.value))
            errors.push("La confirmation du mot de passe est obligatoire.");
        else if (passwordInput.value !== confirmPasswordInput.value)
            errors.push("Les mots de passe ne correspondent pas.");

        if (isEmpty(nameInput.value))
            errors.push("Le prénom est obligatoire.");
        else if (!isValidString(nameInput.value))
            errors.push("Prénom invalide.");

        if (isEmpty(surnameInput.value))
            errors.push("Le nom est obligatoire.");
        else if (!isValidString(surnameInput.value))
            errors.push("Nom invalide.");

        if (isEmpty(telInput.value))
            errors.push("Le téléphone est obligatoire.");
        else if (!isValidPhone(telInput.value))
            errors.push("Le téléphone doit contenir uniquement des chiffres (8 à 15).");

        return errors;
    }


    function buildData(signup) {
        return {
            mail: mailInput.value.trim(),
            password: passwordInput.value,
            ...(signup && {
                name: nameInput.value.trim(),
                surname: surnameInput.value.trim(),
                tel: telInput.value.trim(),
            }),
        };
    }
}
