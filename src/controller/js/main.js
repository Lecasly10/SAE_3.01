//===IMPORT===
import { UI } from "../../modele/js/UI.js";
import { initEvent } from "./event.js";

import { Geolocation } from "../../modele/js/geolocation.js";
import { MapBuilder } from "../../modele/js/builder.js";
import { Navigation } from "../../modele/js/navigation.js";

//===GLOBAL===
globalThis.carIconURL =
  "https://cdn-icons-png.flaticon.com/512/5193/5193688.png";

//===LOAD===
globalThis.addEventListener("load", async () => {
  try {
    UI.toggleLoader(true);
    UI.setupUI();

    const auth = localStorage.getItem("userSession");

    if (!auth) {
      console.log("Pas connecté")
    } else {
      const authInfo = JSON.stringify(auth);
      console.log("Connecté");
    }

    const builder = MapBuilder.init();
    if (!builder) throw new Error("Erreur d'initialisation");
    await builder.initMap();

    const geo = Geolocation.init();
    await geo.locateUser();
    geo.startWatching();

    Navigation.init(builder);

    await initEvent();
  } catch (e) {
    console.error("Erreur lors de l'initialisation de l'app :", e);
    alert("Erreur lors l'initialisation de l'application");
  } finally {
    UI.toggleLoader(false);
  }
});
