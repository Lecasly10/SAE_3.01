//===IMPORT===
import { setupUI, toggleLoader } from "./UI.js";
import { initEvent } from "./event.js";

import { Geolocation } from "../../modele/js/geolocation.js";
import { MapBuilder } from "../../modele/js/builder.js";

//===GLOBAL===
globalThis.carIconURL =
  "https://cdn-icons-png.flaticon.com/512/5193/5193688.png";

//===LOAD===
globalThis.addEventListener("load", async () => {
  try {
    const builder = new MapBuilder();
    await builder.initMap();
    setupUI();

    const geo = new Geolocation(builder);
    await geo.locateUser();

    geo.startWatching();

    await initEvent(builder);
    toggleLoader(false);
  } catch (e) {
    console.error("Erreur lors de l'initialisation de l'app :", e);
  }
});
