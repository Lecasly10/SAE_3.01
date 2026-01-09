import { AppError } from "../errors/errors.js";
import { AppError } from "../errors/globalErrorHandling.js";
import { addMarker } from "../maps/addMarkers.js";
import { Utils } from "../utils.js";

export class GeolocationService {
  constructor(mapService, apiService) {
    this.builder = mapService;
    this.apiService = apiService;
    this.watchId = null;
  }

  async init() {
    try {
      await this.locateUser();
      this.startWatching();
    } catch (error) {
      if (this.builder.debug) this.builder.userMarker = await addMarker(
        this.builder,
        { lat: 49.119178, lng: 6.168469 },
        "Votre Position",
        Utils.carIcon
      );

      throw error;
    }

  }

  async locateUser() {
    const userPosition = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          resolve({ lat: coords.latitude, lng: coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });

    if (!userPosition) throw new AppError("Géolocalisation impossible")

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
  }

  startWatching() {
    if (this.watchId || this.builder.debug) return;

    this.watchId = navigator.geolocation.watchPosition(
      async ({ coords }) => {
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
      (err) => { throw new AppError("Géolocalisation impossible !") },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  static distance(a, b, apiService) {
    const { spherical } = apiService.googleLibs;
    return spherical.computeDistanceBetween(a, b);
  }
}
