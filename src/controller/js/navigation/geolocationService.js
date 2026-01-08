import { addMarker } from "../maps/addMarkers.js";
import { nightMode } from "../maps/nightMode.js";
import { Utils } from "../utils.js";
import { ApiService } from "../api/apiService.js";

export class GeolocationService {
  constructor(mapService) {
    this.builder = mapService;
    this.watchId = null;

  }

  async init() {
    await this.locateUser();
    this.startWatching();
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
          Utils.carIcon
        );
      } else {
        this.builder.userMarker.position = userPosition;
      }

      this.builder.map.setCenter(userPosition);
      return userPosition;
    } catch (err) {
      alert("Géolocalisation indisponible !")

      if (this.builder.debug) this.builder.userMarker = await addMarker(
        this.builder,
        { lat: 49.119178, lng: 6.168469 },
        "Votre Position",
        Utils.carIcon
      );
      console.warn("Erreur Geolocation :", err);
      return null;
    }
  }

  startWatching() {
    if (this.watchId || this.builder.debug) return;

    this.watchId = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        nightMode(this.builder);
        const userPosition = { lat: coords.latitude, lng: coords.longitude };

        if (!this.builder.userMarker) {
          this.builder.userMarker = await addMarker(
            this.builder,
            userPosition,
            "Votre Position",
            Utils.carIcon
          );
        } else {
          this.builder.userMarker.position = userPosition;
        }

      },
      (error) => console.warn("Erreur watchPosition :", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  static distance(a, b) {
    const { spherical } = ApiService.googleLibs;
    return spherical.computeDistanceBetween(a, b);
  }
}
