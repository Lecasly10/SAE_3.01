//===IMPORT===
import { UI } from "./ui/UI.js";
import { initEvent } from "./events/event.js";

import { ApiService } from "./api/apiService.js";
import { Services } from "./services.js";

//===LOAD===
globalThis.addEventListener("load", async () => {
  if (!navigator.onLine) {
    alert("Veuillez vous connecter à internet !");
    return;
  }

  try {
    UI.toggleLoader(true);
    UI.setupUI(true);

    await ApiService.loadGoogleLibs();

    const services = new Services();
    await services.init();


    await initEvent(services);
  } catch (e) {
    console.error("Erreur lors de l'initialisation de l'app :", e);
    alert("Erreur lors l'initialisation de l'application");
  } finally {
    UI.toggleLoader(false);
  }
});
