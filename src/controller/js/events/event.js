import { initVehiculeEvent } from "./vehicule.events.js"
import { initSettingsEvent } from "./settings.events.js";
import { initUserEvent } from "./user.events.js";
import { initMapEvent } from "./map.events.js";
import { UI } from "../ui/UI.js";
import { ERROR_MESSAGES } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";

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
    throw new error;
  }
}
