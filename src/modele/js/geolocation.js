import { addMarker } from "../../controller/js/addMarkers.js";
import { handleCrossIcon } from "../../controller/js/eventHandler.js";
import { toggleLoader } from "../../controller/js/UI.js";
import { nightMode } from "../../controller/js/maps/nightMode.js";
//classe pour setup la géolocalisation dans l'app
export class Geolocation {
  constructor(builder) {
    toggleLoader(true);
    this.builder = builder; //L'objet builder
    this.watchId = null; //ID du watchposition
  }

  async locateUser() {
    try {
      nightMode(this.builder);
      const userPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) =>
            resolve({ lat: coords.latitude, lng: coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      });

      if (!this.builder.userMarker) {
        this.builder.userMarker = await addMarker(
          this.builder,
          userPosition,
          "Votre Position",
          globalThis.carIconURL
        );
      } else {
        this.builder.userMarker.position = userPosition;
      }

      this.builder.map.setCenter(userPosition);

      return userPosition;
    } catch (e) {
      console.warn("Erreur : ", e);
      return null;
    }
  }

  startWatching() {
    this.watchId = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        nightMode(this.builder);
        const userPosition = { lat: coords.latitude, lng: coords.longitude };

        if (!this.builder.userMarker) {
          this.builder.userMarker = await addMarker(
            this.builder,
            userPosition,
            "Votre Position",
            globalThis.carIconURL
          );
        } else {
          this.builder.userMarker.position = userPosition;
        }

        if (this.builder.routes.length > 0 && this.builder.navigation) {
          this.builder.map.panTo(userPosition);
          const route = this.builder.routes[0];
          const destination = route.destination;
          const dist = this.distance(
            this.builder.userMarker.position,
            destination
          );

          if (dist < 0.05) {
            handleCrossIcon();
          }
        }
      },
      (error) => {
        console.warn("Erreur :", error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  distance(a, b) {
    const R = 6371;
    const dLat = this.deg2rad(b.lat - a.lat);
    const dLng = this.deg2rad(b.lng - a.lng);
    const s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.deg2rad(a.lat)) *
        Math.cos(this.deg2rad(b.lat)) *
        Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
