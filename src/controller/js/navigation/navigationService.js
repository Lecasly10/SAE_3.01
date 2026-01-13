import { GeolocationService } from "./geolocationService.js";
import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";
import { StorageService } from "../storage/storageService.js";
import { AppError } from "../errors/errors.js";
import { handleError } from "../errors/globalErrorHandling.js";

const DESTINATION_RADIUS_KM = 0.05;
const MIN_FREE_PLACE = 1;

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
    const savedRoute = StorageService.getToJson(this.storageKey);
    if (savedRoute)
      await this.retrieveRoute(savedRoute);
  }

  async calDistForDest(destination) {
    let dist = GeolocationService.distance(this.mapService.userMarker.position,
      { lat: destination.lat, lng: destination.lng }, this.apiService)
    return {
      ...destination,
      distance: dist,
    };
  }

  async startNavigation(destination) {
    if (this.route) return;
    await this.calDistForDest(destination);
    this.destination = destination;
    await this.buildRoute();
    this.startParkingMonitor();
    this.saveDestination();
  }

  startPreview() {
    if (!this.route) return
    const destination = this.destination
    console.log(destination)
    const { confirm, cancel } = UI.startDestinationPreview(destination);
    const bounds = this.route.bounds;
    const mapService = this.mapService;

    mapService.map.fitBounds(bounds);
    mapService.map.panTo(bounds.getCenter());

    confirm.addEventListener("click", (e) => {
      e.preventDefault();
      this.followRoute();
      this.startFollowRoute();
      UI.setupNavigationUI(destination.name);
    });

    cancel.addEventListener("click", (e) => {
      UI.el.bottomBar.stopButton.click();
    });
  }

  saveDestination() {
    StorageService.set(this.storageKey, this.destination)
  }

  deleteSavedDestination() {
    StorageService.remove(this.storageKey)
  }

  async retrieveRoute(saved) {
    try {
      await this.startNavigation(saved);
      UI.notify("Votre trajet a été retrouvé !")
      this.startPreview();
    } catch (error) {
      handleError(error, "Navigation");
    }
  }

  async stopNavigation() {
    this.stopParkingMonitor();
    this.deleteSavedDestination();
    this.stopFollowRoute();
    this.removeRoute();
    this.destination = null;
  }

  async closestParking() {
    let position = this.mapService.userMarker?.position;

    const resultat = await this.apiService.phpFetch(
      "parking/closest", position);
    return resultat
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
      const d = GeolocationService.distance(position, p, this.apiService);
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

    mapService.setCamera(heading, mapService.navigationTilt);
    mapService.setCenter();
    mapService.setZoom(mapService.navigationZoom);

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

    mapService.setCamera(0, mapService.defaultTilt);
  }


  async startParkingMonitor() {
    if (!this.destination || this.parkMonitor) return;

    this.parkMonitor = setInterval(async () => {

      const mapService = this.mapService;

      const coord = { lat: this.destination.lat, lng: this.destination.lng };
      const dist = GeolocationService.distance(mapService.userMarker.position, coord, this.apiService);

      if (dist < DESTINATION_RADIUS_KM) {
        await this.stopNavigation();
        return;
      }

      const placesCheck = await this.checkParkingAvailability();

      if (placesCheck == null) return;
      if (!placesCheck && !this.redirecting)
        this.startRedirection();

    }, 30000);
  }

  async startRedirection() {
    this.redirecting = true;
    const newDest = await this.closestParking();
    if (newDest) {
      UI.notify("REDIRECTION", "Direction vers le parking le plus proche disponible")
      UI.setupNavigationUI("CHARGEMENT...");
      await this.stopNavigation();
      await this.startNavigation(newDest.data);
      this.followRoute();
      this.startFollowRoute();
      UI.setupNavigationUI(this.destination.name);
    }
    this.redirecting = false;
  }

  stopParkingMonitor() {
    if (this.parkMonitor) {
      clearInterval(this.parkMonitor);
      this.parkMonitor = null;
    }
  }

  async checkParkingAvailability() {
    if (!this.destination) return null;

    const res = await this.apiService.phpFetch("parking/getAvailablePlace", {
      id: this.destination.id,
      lat: this.destination.lat,
      lng: this.destination.lng
    });

    if (res.data?.libre == -1 || res.data?.libre == null)
      return null //parking non smart ou api cassée

    return res.data?.libre >= MIN_FREE_PLACE;

  }

  async buildRoute() {
    const mapService = this.mapService;
    if (!this.destination
      || !mapService.userMarker
      || this.route) return;

    const { Route } = this.apiService.googleLibs;
    const origin = mapService.userMarker.position;
    const destination = {
      lat: this.destination.lat,
      lng: this.destination.lng,
    };

    const marker = await mapService.addMarker(
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

    if (!routes?.length) throw new AppError("Aucun itinéraires trouvé", "ROUTE_NOT_FOUND")

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
    this.route.marker.setMap(null);
    this.route = null;
  }
}
