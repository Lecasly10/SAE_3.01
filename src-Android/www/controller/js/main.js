//===IMPORT===
import { UI } from "./ui/UI.js";
import { initEvent } from "./events/event.js";

import { Geolocation } from "./navigation/geolocation.js";
import { MapBuilder } from "./maps/builder.js";
import { Navigation } from "./navigation/navigation.js";
import { User } from "./user/user.js";

//===LOAD===
document.addEventListener("deviceready", async () => {
  cordova.plugin.http.setDataSerializer('json');
  cordova.plugin.http.setServerTrustMode('nocheck',
    function () { console.log('SSL validation disabled'); },
    function (err) { console.error('Erreur SSL trust mode', err); }
  );

  if (!navigator.onLine) {
    alert("Veuillez vous connecter à internet !");
    return;
  }

  try {
    UI.toggleLoader(true);
    UI.setupUI(true);

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
