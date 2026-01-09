import { MapService } from "./maps/mapService.js";
import { GeolocationService } from "./navigation/geolocationService.js";
import { NavigationService } from "./navigation/navigationService.js";
import { UserService } from "./user/userService.js";
import { VehiculeService } from "./vehicule/vehiculeService.js";
import { StorageService } from "./storage/storageService.js";
import { ApiService } from "./api/apiService.js";
import { AppError } from "./errors/errors.js";
import { UI } from "./ui/UI.js";
//APP SERVICES
export class Services {
    constructor() {
        this.mapService = null;
        this.apiService = null;
        this.storageService = null;
        this.navigationService = null;
        this.geolocationService = null;
        this.user = null;
        this.userService = null;
        this.vehiculeService = null;
    }

    async init() {
        this.storageService = StorageService;
        this.apiService = new ApiService();
        await this.apiService.loadGoogleLibs();

        //MAP
        this.mapService = new MapService(this.apiService);
        await this.mapService.init();

        //GEOLOCATION
        this.geolocationService = new GeolocationService(this.mapService, this.apiService);
        await this.geolocationService.init();

        //NAVIGATION
        this.navigationService = new NavigationService(this.mapService, this.apiService);
        await this.navigationService.init();

        //USER
        this.userService = new UserService(this.apiService);
        this.user = this.userService.user;
        await this.userService.init();

        if (this.user.isLogged) UI.toggleAuthIcon(true);

        //VEHICULE
        this.vehiculeService = new VehiculeService(this.user, this.apiService);
        this.vehiculeService.init();
    }
}
