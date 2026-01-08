//Créer un marqueur sur la map
export function addMarker(builder, pos, message, iconURL) {
  const { AdvancedMarkerElement } = builder.apiService.googleLibs;

  if (!builder.map) {
    throw new Error("La carte n'est pas initialisée !");
  }

  const icon = document.createElement("img");
  icon.src = iconURL;
  icon.style.width = "60px";
  icon.style.height = "60px";

  const marker = new AdvancedMarkerElement({
    map: builder.map,
    position: pos,
    title: message,
    content: icon,
  });

  return marker;
}
