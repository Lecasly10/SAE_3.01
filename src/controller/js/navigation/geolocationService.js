import { AppError } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";

export class GeolocationService {
  constructor(mapService, apiService) {
    this.mapService = mapService;
    this.apiService = apiService;
    this.watchId = null;
  }

  async init() {
    let userPosition = this.mapService.defaultPosition;

    try {
      userPosition = await this.locateUser();
    } catch (error) {
      userPosition = this.mapService.defaultPosition;

      await this.mapService.setUserMarker(userPosition, "Votre position")

      handleError(error, "Géolocalisation");
    }

    this.mapService.map.setCenter(userPosition);
    this.startWatching();
  }


  async locateUser() {
    let userPosition;
    try {
      userPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) =>
            resolve({ lat: coords.latitude, lng: coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      });
    } catch {
      throw new AppError("Géolocalisation impossible", "GEOLOC_ERROR")
    }

    await this.mapService.setUserMarker(userPosition, "Votre position");

    return userPosition;
  }

  startWatching() {
    if (this.watchId) return;

    let notified = false;

    this.watchId = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const userPosition = { lat: coords.latitude, lng: coords.longitude };

        await this.mapService.setUserMarker(userPosition, "Votre position")
      },
      (err) => {
        if (!notified) {
          notified = true;
          const e = new AppError("Géolocalisation impossible !", "GEOLOC_ERROR")
          console.warn(e);
        }

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

  static distance(a, b, apiService) {
    const { spherical } = apiService.googleLibs;
    return spherical.computeDistanceBetween(a, b);
  }
}
