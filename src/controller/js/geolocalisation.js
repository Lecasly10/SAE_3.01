import { addMarker } from "./addMarkers.js";

export async function getPositionOnce(map, defaultPosition) {
  let userMarker = { position: defaultPosition, marker: null };

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
    { enableHighAccuracy: true, maximumAge: 0, timeout: 0 }
  );

  return userMarker;
}

export async function geolocation(map, defaultPosition) {
  let userMarker = { position: defaultPosition, marker: null };

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

  navigator.geolocation.watchPosition(
    async ({ coords }) => {
      const position = { lat: coords.latitude, lng: coords.longitude };

      if (marker) marker.setMap(null);

      marker = await addMarker(
        map,
        position,
        "Votre Position",
        globalThis.carIconURL
      );

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

      userMarker.position = defaultPosition;
      userMarker.marker = marker;
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );

  return userMarker;
}
