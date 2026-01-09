import { StorageService } from "../storage/storageService.js";

export class VehiculeService {
    constructor(user, api) {
        this.user = user;
        this.apiService = api;
        this.selectedVehicule = null;
        this.storageKey = "selected_vehicule"
    }

    async init() {
        this.selectedVehicule = StorageService.getToJson(this.storageKey);
    }

    async load() {
        const vehData = await this.apiService.phpFetch(
            "vehicle/loadAll",
            { id: this.user.userId }
        );

        return vehData;
    }

    async deleteVehicule(id) {
        const deleteResponse = await this.deleteFromDb(id);

        if (this.selectedVehicule && id == this.selectedVehicule.vehId)
            this.deleteFromStorage();

        return deleteResponse;
    }

    addToStorage(vehiculeData) {
        this.selectedVehicule = StorageService.set(this.storageKey, vehiculeData);
    }

    deleteFromStorage() {
        StorageService.remove(this.storageKey);
        this.selectedVehicule = null;
    }

    async deleteFromDb(id) {
        const deleteResponse = await this.apiService.phpFetch(
            "vehicle/delete",
            { id: id }
        );

        return deleteResponse
    }

    async createVehicule(info) {
        const createResponse = await this.apiService.phpFetch(
            "vehicle/create",
            info
        );

        return createResponse
    }

    async updateVehicule(info) {
        const updateResponse = await this.apiService.phpFetch(
            "vehicle/update",
            info
        );

        return updateResponse
    }
}