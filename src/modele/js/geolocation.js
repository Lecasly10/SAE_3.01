import { addMarker } from "../../controller/js/addMarkers.js";
import { nightMode } from "../../controller/js/maps/nightMode.js";
import { MapBuilder } from "./builder.js";
const builder = MapBuilder.instance;

export class Geolocation {
  static watchId = null;

  static async locateUser() {
    try {
      nightMode(builder);

      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) =>
            resolve({ lat: coords.latitude, lng: coords.longitude }),
          reject,
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      });

      if (!builder.userMarker) {
        builder.userMarker = await addMarker(
          builder,
          pos,
          "Votre Position",
          globalThis.carIconURL
        );
      } else {
        builder.userMarker.position = pos;
      }

      builder.map.setCenter(pos);
      return pos;
    } catch (e) {
      console.warn("Erreur locateUser :", e);
      return null;
    }
  }

  static startWatching() {
    if (!builder) throw new Error("Geolocation.init(builder) doit être appelé");

    Geolocation.watchId = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        nightMode(builder);
        const pos = { lat: coords.latitude, lng: coords.longitude };

        if (!builder.userMarker) {
          builder.userMarker = await addMarker(
            builder,
            pos,
            "Votre Position",
            globalThis.carIconURL
          );
        } else {
          builder.userMarker.position = pos;
        }
      },
      (err) => console.warn("Erreur watchPosition :", err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  static stopWatching() {
    if (Geolocation.watchId !== null) {
      navigator.geolocation.clearWatch(Geolocation.watchId);
      Geolocation.watchId = null;
    }
  }

  static distance(a, b) {
    const R = 6371;
    const dLat = Geolocation.deg2rad(b.lat - a.lat);
    const dLng = Geolocation.deg2rad(b.lng - a.lng);
    const s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(Geolocation.deg2rad(a.lat)) *
        Math.cos(Geolocation.deg2rad(b.lat)) *
        Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
