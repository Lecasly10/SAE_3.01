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
