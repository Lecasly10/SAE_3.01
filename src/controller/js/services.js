import { MapService } from "./maps/mapService.js";
import { GeolocationService } from "./navigation/geolocationService.js";
import { NavigationService } from "./navigation/navigation.js";
import { User } from "./user/user.js";

export class Services {
    constructor() {
        this.mapService = new MapService();
        // this.storageService = new StorageService();
        this.navigationService = new NavigationService(this.mapService);
        this.geolocationService = new GeolocationService(this.mapService);
        this.user = new User();
        // this.userService = new UserService();
        // this.vehiculeService = new VehiculeService();
    }
}