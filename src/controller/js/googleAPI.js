let libs = {};

//GOOGLE API
export async function loadGoogleLibs() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { Route } = await google.maps.importLibrary("routes");

  libs = { Map, AdvancedMarkerElement, ColorScheme, Route };
}

export function getGoogleLibs() {
  return libs;
}
