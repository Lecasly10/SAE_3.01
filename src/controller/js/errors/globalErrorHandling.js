import { ERROR_MESSAGES } from "./errors";

export function handleError(error, context = "") {
    console.error(`[${context}]`, error);

    let message = ERROR_MESSAGES.DEFAULT;

    if (error instanceof AppError && ERROR_MESSAGES[error.code]) {
        message = ERROR_MESSAGES[error.code];
    }

    UI.notify(context || "Erreur", message);
}