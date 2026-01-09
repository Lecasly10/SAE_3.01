//===IMPORT===
import { UI } from "./ui/UI.js";
import { initEvent } from "./events/event.js";

import { Services } from "./services.js";
import { NetworkError } from "./errors/errors.js";
import { handleError } from "./errors/globalErrorHandling.js";

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
    handleError(error, "APP");
  } finally {
    UI.toggleLoader(false);
  }
});
