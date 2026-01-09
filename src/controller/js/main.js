//===IMPORT===
import { UI } from "./ui/UI.js";
import { initEvent } from "./events/event.js";

import { Services } from "./services.js";
import { AppError, ERROR_MESSAGES, NetworkError } from "./errors/errors.js";

//===LOAD===
globalThis.addEventListener("load", async () => {
  try {
    UI.toggleLoader(true);
    UI.setupUI(true);

    if (!navigator.onLine) {
      throw new NetworkError("Aucune connexion internet !");
    }

    const services = new Services();
    await services.init();

    await initEvent(services);
  } catch (error) {
    console.error(error);
    UI.notify(
      ERROR_MESSAGES[error.code] ??
      ERROR_MESSAGES["DEFAULT"]
    );
  } finally {
    UI.toggleLoader(false);
  }
});
