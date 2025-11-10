import { getGoogleLibs } from "./googleAPI.js";

export async function addMarker(map, pos, message, iconURL) {
  const { AdvancedMarkerElement } = getGoogleLibs();

  const icon = document.createElement("img");
  icon.src = iconURL;
  icon.style.width = "60px";
  icon.style.height = "60px";

  const marker = new AdvancedMarkerElement({
    map,
    title: message,
    position: pos,
    content: icon,
  });

  return marker;
}
