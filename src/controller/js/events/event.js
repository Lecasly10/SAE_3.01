import { initVehiculeEvent } from "./vehicule.events.js"
import { initSettingsEvent } from "./settings.events.js";
import { initUserEvent } from "./user.events.js";
import { initMapEvent } from "./map.events.js";

export async function initEvent(services) {
  window.addEventListener('offline', () => {
    console.warn("User offline !");
    alert("La connexion à été perdu :(")
  });

  window.addEventListener('online', () => {
    console.warn("User online !");
    alert("La connexion à été retrouvée :)")
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
    console.error("Erreur : ", error);
    alert('Une erreur est survenue !')
  }
}
