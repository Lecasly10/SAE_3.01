let libs = {};

//charger les libs de l'api google
export async function loadGoogleLibs() {
  const { Map } = await google.maps.importLibrary("maps");
  await google.maps.importLibrary("geometry");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { Route } = await google.maps.importLibrary("routes");

  libs = { Map, AdvancedMarkerElement, ColorScheme, Route };
}

//Récup une libs
export function getGoogleLibs() {
  return libs;
}
