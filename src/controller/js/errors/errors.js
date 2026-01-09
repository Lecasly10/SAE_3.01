export const ERROR_MESSAGES = {
    EMAIL_ALREADY_EXISTS: "Cette adresse email est déjà utilisée !",
    NETWORK_ERROR: "Connexion internet indisponible !",
    AUTH_ERROR: "Erreur d’authentification !",
    INVALID_CREDENTIALS: "Adresse mail ou mot de passe incorrect !",
    DEFAULT: "Une erreur est survenue. Veuillez réessayer !",
};

export class AppError extends Error {
    constructor(message, code = "APP_ERROR") {
        super(message);
        this.code = code;
    }
}

export class AuthError extends AppError {
    constructor(message = "Erreur d'authentification") {
        super(message, "AUTH_ERROR");
    }
}

export class ApiError extends AppError {
    constructor(message = "Erreur serveur", status = 500) {
        super(message, "API_ERROR");
        this.status = status;
    }
}

export class NetworkError extends AppError {
    constructor(message = "Erreur réseaux") {
        super(message, "NETWORK_ERROR");
    }
}
