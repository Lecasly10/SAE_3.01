//===IMPORT===
import { defaultPosition, initMap } from "./mapConfig.js";
import { setupUI } from "./UI.js";
import { initEvent } from "./event.js";
import { getPosition, startWatchPosition } from "./geolocalisation.js";

//===GLOBAL===
globalThis.carIconURL =
  "https://cdn-icons-png.flaticon.com/512/8308/8308414.png";

globalThis.routes = globalThis.routes || [];

//===LOAD===
globalThis.addEventListener("load", async (e) => {
  const map = await initMap(); //Google Map
  setupUI();

  let userMarker = { position: defaultPosition, marker: null };

  userMarker = await getPosition(map, userMarker); //User Position
  userMarker = await startWatchPosition(map, userMarker); //Watch user position in real time

  await initEvent(map, userMarker); //eventListner
});
