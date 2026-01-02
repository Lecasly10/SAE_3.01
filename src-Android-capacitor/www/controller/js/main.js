//===IMPORT===
import { UI } from "./ui/UI.js";
import { initEvent } from "./events/event.js";

import { Geolocation } from "./navigation/geolocation.js";
import { MapBuilder } from "./maps/builder.js";
import { Navigation } from "./navigation/navigation.js";
import { User } from "./user/user.js";

//===LOAD===
globalThis.addEventListener("load", async () => {
  if (!navigator.onLine) {
    alert("Veuillez vous connecter à internet !");
    return;
  }

  try {
    UI.toggleLoader(true);
    UI.setupUI();

    const builder = MapBuilder.init();
    if (!builder) throw new Error("Erreur d'initialisation");
    await builder.initMap();

    const geo = Geolocation.init();
    await geo.locateUser();
    geo.startWatching();

    Navigation.init(builder);
    User.init();

    await initEvent();

  } catch (e) {
    console.error("Erreur lors de l'initialisation de l'app :", e);
    alert("Erreur lors l'initialisation de l'application");
  } finally {
    UI.toggleLoader(false);
  }
});
