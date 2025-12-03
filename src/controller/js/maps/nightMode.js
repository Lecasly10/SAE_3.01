import { darkId, lightId } from "./styles.js";

export function nightMode(builder) {
  const now = new Date();
  const hour = now.getHours();
  const isNight = hour >= 20 || hour < 6;

  if (isNight && !builder.nightMode) {
    builder.nightMode = true;
    builder.map.setOptions({
      mapId: darkId,
    });
  } else if (!isNight && builder.nightMode) {
    builder.nightMode = false;
    builder.map.setOptions({
      mapId: lightId,
    });
  }
}
