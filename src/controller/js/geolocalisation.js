import { addMarker } from "./addMarkers.js";
import { defaultOptions } from "./mapConfig.js";

const defaultPosition = defaultOptions.defaultPosition;

export async function getPosition(map, userMarker) {
  let marker = await addMarker(
    map,
    defaultPosition,
    "Votre position",
    globalThis.carIconURL
  );
  userMarker.marker = marker;

  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
    return userMarker;
  }

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      const position = { lat: coords.latitude, lng: coords.longitude };

      if (marker) marker.setMap(null);

      marker = await addMarker(
        map,
        position,
        "Votre Position",
        globalThis.carIconURL
      );

      map.setCenter(position);
      userMarker.position = position;
      userMarker.marker = marker;
    },
    async (error) => {
      console.warn("Erreur de géolocalisation :", error);

      if (marker) marker.setMap(null);
      marker = await addMarker(
        map,
        defaultPosition,
        "Votre Position",
        globalThis.carIconURL
      );
      map.setCenter(defaultPosition);

      userMarker.position = defaultPosition;
      userMarker.marker = marker;
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );

  return userMarker;
}

export function startWatchPosition(map, userMarker) {
  if (!navigator.geolocation) return userMarker;

  navigator.geolocation.watchPosition(
    async ({ coords }) => {
      const position = { lat: coords.latitude, lng: coords.longitude };

      if (userMarker.marker) userMarker.marker.setMap(null);

      let marker = await addMarker(
        map,
        position,
        "Votre Position",
        globalThis.carIconURL
      );

      userMarker.position = position;
      userMarker.marker = marker;
    },
    (error) => {
      console.warn("Erreur de suivi de géolocalisation :", error);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );

  return userMarker;
}
