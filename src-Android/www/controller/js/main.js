//===IMPORT===
import { UI } from "./ui/UI.js";
import { initEvent } from "./events/event.js";

import { Services } from "./services.js";
import { NetworkError } from "./errors/errors.js";
import { handleError } from "./errors/globalErrorHandling.js";

//===LOAD===
document.addEventListener("deviceready", async () => {
  cordova.plugin.http.setDataSerializer('json');
  cordova.plugin.http.setServerTrustMode('nocheck',
    function () { console.log('SSL validation disabled'); },
    function (err) { console.error('Erreur SSL trust mode', err); }
  );
  try {


    const { loader } = UI.el.topBar;
    UI.show(loader);
    UI.setupUI(true);

    if (!navigator.onLine) {
      throw new NetworkError("Aucune connexion internet !");
    }

    const services = new Services();
    await services.init();

    await initEvent(services);

  } catch (error) {
    handleError(error, "Initialisation");
  } finally {
    UI.hide(loader);
  }
});
