import { MapService } from "./maps/mapService.js";
import { GeolocationService } from "./navigation/geolocationService.js";
import { NavigationService } from "./navigation/navigationService.js";
import { User } from "./user/user.js";

export class Services {
    constructor() {
        this.mapService = null;
        this.storageService = null;
        this.navigationService = null;
        this.geolocationService = null;
        this.user = null;
        this.userService = null;
        this.vehiculeService = null;
    }

    async init() {
        this.mapService = new MapService();
        await this.mapService.init();

        this.geolocationService = new GeolocationService(this.mapService);
        await this.geolocationService.init();

        this.navigationService = new NavigationService(this.mapService);
        await this.navigationService.init();


        this.user = new User();
        await this.user.init();
    }
}
