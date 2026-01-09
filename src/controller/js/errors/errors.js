export const ERROR_MESSAGES = {
    EMAIL_ALREADY_EXISTS: "Cette adresse email est déjà utilisée !",
    AUTH_ERROR: "Erreur d’authentification !",
    INVALID_CREDENTIALS: "Adresse mail ou mot de passe incorrect !",
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
