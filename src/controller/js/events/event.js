import { initVehiculeEvent } from "./vehicule.events.js"
import { initSettingsEvent } from "./settings.events.js";
import { initUserEvent } from "./user.events.js";
import { initMapEvent } from "./map.events.js";
import { UI } from "../ui/UI.js";

export async function initEvent(services) {
  window.addEventListener('offline', () => {
    UI.notify("Connexion", "Connexion perdu !");
  });

  window.addEventListener('online', () => {
    if (!services.areLoaded) {
      location.reload();
    }
    UI.notify("Connexion", "Connexion retouvée !");
  });

  initVehiculeEvent(services);
  initSettingsEvent(services);
  initUserEvent(services);
  initMapEvent(services);

}
