import { AppError } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";
import { addMarker } from "../maps/addMarkers.js";
import { Utils } from "../utils.js";

export class GeolocationService {
  constructor(mapService, apiService) {
    this.builder = mapService;
    this.apiService = apiService;
    this.watchId = null;
  }

  async init() {
    let userPosition = this.builder.defaultPosition;

    try {
      userPosition = await this.locateUser();
    } catch (error) {
      userPosition = this.builder.defaultPosition;

      this.builder.userMarker = await addMarker(
        this.builder,
        userPosition,
        "Votre Position",
        Utils.carIcon
      );


      handleError(error, "Géolocalisation");
    }

    this.builder.map.setCenter(userPosition);
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

    return userPosition;
  }

  startWatching() {
    if (this.watchId) return;

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
      (err) => {
        const e = new AppError("Géolocalisation impossible !", "GEOLOC_ERROR")
        console.warn(e);
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
