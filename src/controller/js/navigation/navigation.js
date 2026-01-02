import { addMarker } from "../maps/addMarkers.js";
import { getGoogleLibs } from "../api/googleAPI.js";
import { phpFetch } from "../api/phpInteraction.js";
import { Geolocation } from "./geolocation.js";
import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";

export class Navigation {
  static instance = null;
  static builder = null;

  static async init(builder) {
    if (!Navigation.instance) Navigation.instance = new Navigation();
    Navigation.builder = builder;

    try {
      const savedRoute = JSON.parse(localStorage.getItem("destination"));
      if (savedRoute && savedRoute.name) await Navigation.instance.retrieveRoute(savedRoute);
    } catch (e) {
      console.error("Erreur pendant la récup du trajet : ", e);
      UI.setupUI();
    }

    return Navigation.instance;
  }

  static getInstance() {
    if (!Navigation.instance)
      throw new Error("Navigation non init !");
    return Navigation.instance;
  }

  constructor() {
    if (Navigation.instance)
      throw new Error("Navigation déjà init");

    this.parkMonitor = null;
    this.destination = null;
    this.route = null;
    this.followingRoute = null;
    this.focus = false;
    this.redirecting = false;
  }

  async startNavigation(destination) {
    if (this.route) return;

    this.destination = destination;
    await this.buildRoute();
    this.startParkingMonitor();
    this.saveDestination();
  }

  startPreview() {
    if (!this.route) return
    const destination = this.destination
    const { confirm, cancel } = UI.togglePreview(destination);
    const { crossIcon } = UI.el
    const bounds = this.route.bounds;
    const builder = Navigation.builder;

    builder.map.fitBounds(bounds);
    builder.map.panTo(bounds.getCenter());

    confirm.addEventListener("click", (e) => {
      e.preventDefault();
      builder.map.panTo(builder.userMarker.position);
      builder.map.setZoom(25);
      this.focus = true;
      this.startFollowRoute();
      UI.toggleNavigationUI(destination.name);
    });

    cancel.addEventListener("click", (e) => {
      const stopEvent = new Event("click");
      crossIcon.dispatchEvent(stopEvent);
    });
  }

  saveDestination() {
    const key = "destination"
    try {
      this.deleteSavedDestination;
      localStorage.setItem(key, JSON.stringify(this.destination));
    } catch (e) {
      console.error("Erreur pendant la sauvegarde du trajet : ", e);
    }

  }

  deleteSavedDestination() {
    const key = "destination"
    try {
      if (localStorage.getItem(key)) localStorage.removeItem(key);
    } catch (e) {
      console.error("Erreur pendant la suppression du trajet : ", e);
    }
  }

  async retrieveRoute(saved) {
    UI.notify("Votre trajet a été retrouvé !")
    await this.startNavigation(saved);
    this.startPreview();
  }

  async stopNavigation() {
    this.stopParkingMonitor();
    this.deleteSavedDestination();
    this.stopFollowRoute();
    this.removeRoute();
    this.destination = null;
    this.focus = false;
  }

  async closestParking() {
    try {
      let position = Navigation.builder.userMarker.position;

      const resultat = await phpFetch("parking/closest", position);
      if (!resultat) throw new Error("Erreur serveur !")
      if (resultat.status === "success") return resultat
      else if (resultat.message) {
        alert(resultat.message)
        UI.setupUI();
      }
    } catch (error) {
      UI.setupUI();
      console.error("Erreur : ", error);
    }
  }

  startFollowRoute() {
    if (!this.route || this.followingRoute) return;

    this.followingRoute = true;

    this.followInterval = setInterval(() => {
      if (!this.route) return;

      const builder = Navigation.builder;
      const path = this.route.polylines[0].getPath();
      const position = builder.userMarker?.position;
      if (!position || path.getLength() < 2) return;


      let closestIndex = 0;
      let minDist = Infinity;

      path.forEach((p, i) => {
        const d = google.maps.geometry.spherical.computeDistanceBetween(position, p);
        if (d < minDist) {
          minDist = d;
          closestIndex = i;
        }
      });

      if (closestIndex >= path.getLength() - 1) return;

      const from = path.getAt(closestIndex);
      const to = path.getAt(closestIndex + 1);

      const heading =
        google.maps.geometry.spherical.computeHeading(from, to);

      builder.map.moveCamera({
        center: position,
        heading,
        tilt: 60,
        zoom: 25
      });

    }, 1000);
  }

  stopFollowRoute() {
    this.followingRoute = false;

    if (this.followInterval) {
      clearInterval(this.followInterval);
      this.followInterval = null;
    }
    const builder = Navigation.builder;

    builder.map.moveCamera({
      heading: 0,
      tilt: 0
    });
  }


  async startParkingMonitor() {
    if (!this.destination || this.parkMonitor) return;

    this.parkMonitor = setInterval(async () => {

      const builder = Navigation.builder;

      const coord = { lat: this.destination.lat, lng: this.destination.lng };
      const dist = Geolocation.distance(builder.userMarker.position, coord);

      if (dist < 0.05) {
        await this.stopNavigation();
        return;
      }

      const placesLibres = await this.checkParkingAvailability();

      if (!placesLibres || placesLibres == -1) return;
      if (placesLibres < 1 && !this.redirecting) {
        this.redirecting = true;
        UI.toggleNavigationUI("CHARGEMENT...");
        await this.stopNavigation();
        const newDest = await this.closestParking();
        if (newDest) {
          await this.startNavigation(newDest);
          UI.toggleNavigationUI(newDest.name);
          this.focus = true;
        }
        this.redirecting = false;
      }
    }, 5000);
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
      const res = await phpFetch("parking/load", {
        id: this.destination.id,
      });
      return res.parking.places_libres;
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
      Utils.distIcon
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
