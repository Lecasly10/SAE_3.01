import { addMarker } from "./addMarkers.js";

export async function geolocation(map, defaultPosition) {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
    return;
  }

  let marker = await addMarker(
    map,
    defaultPosition,
    "Votre position",
    globalThis.carIconURL
  );

  navigator.geolocation.watchPosition(
    async ({ coords }) => {
      const position = { lat: coords.latitude, lng: coords.longitude };
      marker.setMap(null);
      marker = await addMarker(
        map,
        position,
        "Votre Position",
        globalThis.carIconURL
      );
      map.setCenter(position);
    },
    async (error) => {
      console.warn("Erreur de géolocalisation :", error);
      marker.setMap(null);
      marker = await addMarker(
        map,
        defaultPosition,
        "Votre Position",
        globalThis.carIconURL
      );
      map.setCenter(defaultPosition);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );

  return marker;
}
