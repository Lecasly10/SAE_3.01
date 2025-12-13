import { addMarker } from "../../controller/js/addMarkers.js";
import { nightMode } from "../../controller/js/maps/nightMode.js";
import { MapBuilder } from "./builder.js";

export class Geolocation {
  static instance = null;

  static init() {
    if (!Geolocation.instance) Geolocation.instance = new Geolocation();
    return Geolocation.instance;
  }

  static getInstance() {
    if (!Geolocation.instance) throw new Error("Geolocation non init.");
    return Geolocation.instance;
  }

  constructor() {
    if (Geolocation.instance) throw new Error("Geolocation déjà init");
    this.builder = MapBuilder.getInstance();
    this.watchId = null;
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
    } catch (err) {
      alert("Géolocalisation indisponible !")

      if (this.builder.debug) this.builder.userMarker = await addMarker(
        this.builder,
        { lat: 49.119178, lng: 6.168469 },
        "Votre Position",
        globalThis.carIconURL
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
            globalThis.carIconURL
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
