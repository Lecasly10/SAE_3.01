import { initVehiculeEvent } from "./vehicule.events.js"
import { initSettingsEvent } from "./settings.events.js";
import { initUserEvent } from "./user.events.js";
import { initMapEvent } from "./map.events.js";
import { UI } from "../ui/UI.js";
import { ERROR_MESSAGES } from "../errors/errors.js";

export async function initEvent(services) {
  window.addEventListener('offline', () => {
    UI.notify("Connexion", "Connexion perdu !");
  });

  window.addEventListener('online', () => {
    UI.notify("Connexion", "Connexion retouvée !");
  });

  window.addEventListener('error', (event) => {
    console.error('Erreur :', event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error("Erreur :", event.reason);
  });

  try {
    initVehiculeEvent(services);
    initSettingsEvent(services);
    initUserEvent(services);
    initMapEvent(services);
  } catch (error) {
    console.error(error);
    UI.notify("App", ERROR_MESSAGES["DEFAULT"]);
  }
}
