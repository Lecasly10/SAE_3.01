import { ERROR_MESSAGES, AppError } from "./errors.js";
import { UI } from "../ui/UI.js";

export function handleError(error, context = null) {
    console.error(`[${context}]`, error);

    let message = ERROR_MESSAGES.DEFAULT;

    if (error instanceof AppError && ERROR_MESSAGES[error.code]) {
        message = ERROR_MESSAGES[error.code];
    }

    UI.notify(context || "Erreur", message);
}