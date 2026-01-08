import { addMarker } from "../maps/addMarkers.js";
import { phpFetch } from "../api/phpInteraction.js";
import { GeolocationService } from "./geolocationService.js";
import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";
import { StorageService } from "../storage/storageService.js";

const DESTINATION_RADIUS_KM = 0.05;

export class NavigationService {
  constructor(mapService, apiService) {
    this.mapService = mapService;
    this.apiService = apiService;
    this.parkMonitor = null;
    this.destination = null;
    this.route = null;
    this.followingRoute = null;
    this.redirecting = false;
    this.storageKey = "destination"
  }

  async init() {
    try {
      const savedRoute = StorageService.getToJson(this.storageKey);
      if (savedRoute && savedRoute.name) await this.retrieveRoute(savedRoute);
    } catch (e) {
      console.error("Erreur pendant la récup du trajet : ", e);
      UI.setupUI();
    }
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
    const mapService = this.mapService;

    mapService.map.fitBounds(bounds);
    mapService.map.panTo(bounds.getCenter());

    confirm.addEventListener("click", (e) => {
      e.preventDefault();
      this.followRoute();
      this.startFollowRoute();
      UI.toggleNavigationUI(destination.name);
    });

    cancel.addEventListener("click", (e) => {
      const stopEvent = new Event("click");
      crossIcon.dispatchEvent(stopEvent);
    });
  }

  saveDestination() {
    StorageService.set(this.storageKey, this.destination)
  }

  deleteSavedDestination() {
    StorageService.remove(this.storageKey)
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
  }

  async closestParking() {
    try {
      let position = this.mapService.userMarker.position;

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

  followRoute() {
    if (!this.route) return;

    const mapService = this.mapService;
    const path = this.route.polylines[0].getPath();
    const position = mapService.userMarker?.position;
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

    mapService.map.moveCamera({
      center: position,
      heading,
      tilt: 60,
      zoom: 22,
    });
  }

  startFollowRoute() {
    if (!this.route || this.followingRoute) return;

    this.followingRoute = true;

    this.followInterval = setInterval(() => {
      this.followRoute();
    }, 2000);
  }

  pauseFollowRoute() {
    this.followingRoute = false;

    if (this.followInterval) {
      clearInterval(this.followInterval);
      this.followInterval = null;
    }
  }

  stopFollowRoute() {
    this.pauseFollowRoute();
    const mapService = this.mapService;

    mapService.map.moveCamera({
      heading: 0,
      tilt: mapService.defaultAngle
    });
  }


  async startParkingMonitor() {
    if (!this.destination || this.parkMonitor) return;

    this.parkMonitor = setInterval(async () => {

      const mapService = this.mapService;

      const coord = { lat: this.destination.lat, lng: this.destination.lng };
      const dist = GeolocationService.distance(mapService.userMarker.position, coord);

      if (dist < DESTINATION_RADIUS_KM) {
        await this.stopNavigation();
        return;
      }

      const placesLibres = await this.checkParkingAvailability();
      if (placesLibres == null) return;

      if (placesLibres < 1 && !this.redirecting) {
        this.redirecting = true;
        const newDest = await this.closestParking();
        if (newDest) {
          UI.notify("REDIRECTION", "Direction vers le parking le plus proche disponible")
          UI.toggleNavigationUI("CHARGEMENT...");
          await this.stopNavigation();
          await this.startNavigation(newDest);
          this.followRoute();
          this.startFollowRoute();
          UI.toggleNavigationUI(this.destination.name);
        }
        this.redirecting = false;
      }
    }, 30000);
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
      const res = await phpFetch("parking/getAvailablePlace", {
        id: this.destination.id,
        lat: this.destination.lat,
        lng: this.destination.lng
      });
      return res.libre == -1 || res.libre == null ? null : res.libre;
    } catch (err) {
      console.error("Erreur checkParkingAvailability :", err);
      return null;
    }
  }

  async buildRoute() {
    const mapService = this.mapService;
    if (!this.destination || !mapService?.userMarker) return;
    if (this.route) return;

    const { Route } = this.apiService.googleLibs;
    const origin = mapService.userMarker.position;
    const destination = {
      lat: this.destination.lat,
      lng: this.destination.lng,
    };

    const marker = await addMarker(
      mapService,
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
    polylines.forEach((p) => p.setMap(mapService.map));

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
