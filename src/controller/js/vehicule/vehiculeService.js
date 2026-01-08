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
        try {
            const vehData = await this.apiService.phpFetch("vehicle/loadAll", { id: this.user.userId });
            return vehData
        } catch (error) {
            if (error instanceof Error)
                console.error("[ERREUR] VehiculeService - load : ", error);
            alert("Une erreur s'est produite !");
        }
    }

    async deleteVehicule(id) {
        const deleteResponse = await this.deleteFromDb(id);
        if (deleteResponse.success) {
            if (this.selectedVehicule && id == this.selectedVehicule.vehId)
                StorageService.remove(this.storageKey);
        }

        return deleteResponse;
    }

    addToStorage(vehiculeData) {
        this.selectedVehicule = StorageService.set(this.storageKey, vehiculeData);
    }

    deleteFromStorage() {
        this.selectedVehicule = null;
        StorageService.remove(this.storageKey);
    }

    async deleteFromDb(id) {
        try {
            const deleteResponse = await this.apiService.phpFetch("vehicle/delete", { id: id })
            return deleteResponse
        } catch (e) {
            if (error instanceof Error)
                console.error("[ERREUR] VehiculeService - deleteFromDb : ", error);
            alert("Une erreur s'est produite, veuillez réesseyer !");
        }

    }

    async createVehicule(info) {
        try {
            const data = await this.apiService.phpFetch("vehicle/create", info)
            return data
        } catch (e) {
            if (error instanceof Error)
                console.error("[ERREUR] VehiculeService - createVehicule : ", error);
            alert("Une erreur s'est produite, veuillez réesseyer !");
        }

    }

    async updateVehicule(info) {
        try {
            const data = await this.apiService.phpFetch("vehicle/update", info)
            return data
        } catch (e) {
            if (error instanceof Error)
                console.error("[ERREUR] VehiculeService - updateVehicule : ", error);
            alert("Une erreur s'est produite, veuillez réesseyer !");
        }

    }
}