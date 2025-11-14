import { addMarker } from "./addMarkers.js";
import { handleCrossIcon } from "./eventHandler.js";
import { defaultOptions } from "./mapConfig.js";

const { defaultPosition } = defaultOptions;

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

      if (globalThis.routes.length > 0 && globalThis.navigation) {
        let route = globalThis.routes[0];
        let destination = route.destination;
        let dist = distance(userMarker.position, destination);

        if (dist < 0.05) {
          handleCrossIcon();
        }
      }
    },
    (error) => {
      console.warn("Erreur de suivi de géolocalisation :", error);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );

  return userMarker;
}

function distance(a, b) {
  const R = 6371;
  const dLat = deg2rad(b.lat - a.lat);
  const dLng = deg2rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(a.lat)) *
      Math.cos(deg2rad(b.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
