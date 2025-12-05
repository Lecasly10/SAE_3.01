import { addMarker } from "../../controller/js/addMarkers.js";
import { getGoogleLibs } from "../../controller/js/googleAPI.js";
import { phpFetch } from "../../controller/js/phpInteraction.js";
import { Geolocation } from "./geolocation.js";

const destinationIconURL =
  "https://cdn-icons-png.flaticon.com/512/4668/4668400.png";

export class Navigation {
  static instance = null;
  static builder = null;

  static init(builder) {
    if (!Navigation.instance) Navigation.instance = new Navigation();
    Navigation.builder = builder;
    return Navigation.instance;
  }

  static getInstance() {
    if (!Navigation.instance)
      throw new Error("Navigation n'a pas été initialisé !");
    return Navigation.instance;
  }

  constructor() {
    if (Navigation.instance)
      throw new Error("Utilisez Navigation.init(builder)");

    this.parkMonitor = null;
    this.destination = null;
    this.route = null;
    this.focus = false;
    this.redirecting = false;
  }

  async startNavigation(destination) {
    if (this.route) this.removeRoute();
    if (this.parkMonitor) this.stopParkingMonitor();

    this.destination = destination;
    await this.buildRoute();
    this.startParkingMonitor();
  }

  async stopNavigation() {
    this.stopParkingMonitor();
    this.removeRoute();
    this.destination = null;
    this.focus = false;
  }

  async closestParking() {
    try {
      let position = Navigation.builder.userMarker.position;
      const resultat = await phpFetch("closestParking.php", position);
      if (
        !resultat ||
        !resultat.lat ||
        !resultat.lng ||
        !resultat.id ||
        !resultat.name
      )
        throw new Error("Aucune donnée trouvé");
      if (isNaN(resultat.lat) || isNaN(resultat.lng))
        throw new Error("Coordonnées invalides");
      return { ...resultat };
    } catch (error) {
      console.error("Erreur : ", error);
      return null;
    }
  }

  async startParkingMonitor() {
    if (!this.destination || this.parkMonitor) return;

    this.parkMonitor = setInterval(async () => {
      const builder = Navigation.builder;
      if (!builder?.userMarker) return;

      const coord = { lat: this.destination.lat, lng: this.destination.lng };
      const dist = Geolocation.distance(builder.userMarker.position, coord);

      //Suivre le marker
      if (this.focus) {
        builder.map.panTo(builder.userMarker.position);
      }

      //Arrivé a destination
      if (dist < 0.05) {
        await this.stopNavigation();
        return;
      }

      //Redirection si plus de place
      const placesLibres = await this.checkParkingAvailability();
      if (!placesLibres && !this.redirecting) {
        this.redirecting = true;
        await this.stopNavigation();
        const newDest = await this.closestParking();
        if (newDest) {
          await this.startNavigation(newDest);
          this.focus = true;
        }
        this.redirecting = false;
      }
    }, 10000);
  }

  stopParkingMonitor() {
    if (this.parkMonitor) {
      clearInterval(this.parkMonitor);
      this.parkMonitor = null;
    }
  }

  async checkParkingAvailability() {
    if (!this.destination) return null;

    try {
      const res = await phpFetch("parkingInfo.php", {
        id: this.destination.id,
      });
      return res?.parking?.places_libres > 0 || false;
    } catch (err) {
      console.error("Erreur checkParkingAvailability :", err);
      return null;
    }
  }

  async buildRoute() {
    const builder = Navigation.builder;
    if (!this.destination || !builder?.userMarker) return;
    if (this.route) return;

    const { Route } = getGoogleLibs();
    const origin = builder.userMarker.position;
    const destination = {
      lat: this.destination.lat,
      lng: this.destination.lng,
    };

    const marker = await addMarker(
      builder,
      destination,
      `Votre destination : ${this.destination.name}`,
      destinationIconURL
    );

    const { routes } = await Route.computeRoutes({
      origin,
      destination,
      travelMode: "DRIVING",
      routingPreference: "TRAFFIC_AWARE",
      fields: ["path"],
    });

    if (!routes?.length) return alert("Aucun itinéraire trouvé");

    const route = routes[0];
    const polylines = route.createPolylines();
    polylines.forEach((p) => p.setMap(builder.map));

    const bounds = new google.maps.LatLngBounds();
    polylines.forEach((p) =>
      p.getPath().forEach((latLng) => bounds.extend(latLng))
    );

    this.route = { bounds, destination: this.destination, polylines, marker };
  }

  removeRoute() {
    if (!this.route) return;
    this.route.polylines.forEach((p) => p.setMap(null));
    this.route.marker?.setMap(null);
    this.route = null;
  }
}
