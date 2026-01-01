import { MapBuilder } from "../maps/builder.js";
import { Navigation } from "../navigation/navigation.js";
import { User } from "../user/user.js";
import { UI } from "../ui/UI.js";

import { initVehiculeEvent } from "./vehicule.events.js"
import { initSettingsEvent } from "./settings.events.js";
import { initUserEvent } from "./user.events.js";
import { initMapEvent } from "./map.events.js";

export async function initEvent() {
  const builder = MapBuilder.getInstance();
  const navigation = Navigation.getInstance();
  const user = User.getInstance();

  document.addEventListener('offline', () => {
    console.warn("User offline !");
    UI.notify("La connexion a été perdu :( ")
  });

  window.addEventListener('error', (event) => {
    console.error('Erreur :', event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error("Erreur :", event.reason);
  });

  UI.el.goCenterButton.addEventListener("click", () => {
    UI.notify("MAP", "Map recentré !");
    builder.map.panTo(builder.userMarker.position);
  });

  initVehiculeEvent(user);
  initSettingsEvent(user);
  initUserEvent(user);
  initMapEvent(user, navigation, builder)
}
