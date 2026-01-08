import { StorageService } from "../storage/storageService.js";
import { phpFetch } from "../api/phpInteraction.js";

export class VehiculeService {
    constructor(user) {
        this.user = user
        this.selectedVehicule = null;
        this.storageKey = "selected_vehicule"
    }

    async init() {
        this.selectedVehicule = StorageService.getToJson(this.storageKey);
    }

    async load() {
        try {
            const data = await phpFetch("vehicle/loadAll", { id: this.user.userId })
            if (!data) throw new Error("Erreur serveur !");
            else {
                return data
            }
        } catch (error) {
            console.error("Load info error: ", error)
        }
    }

    async deleteVehicule(id) {
        const deleteResponse = await this.deleteFromDb(id);
        if (deleteResponse.status === "success") {
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
            const deleteResponse = await phpFetch("vehicle/delete", { id: id })
            if (!deleteResponse) throw new Error("Erreur serveur !")
            return deleteResponse
        } catch (e) {
            console.error("Erreur : ", e);
        }

    }

    async createVehicule(info) {
        try {
            const data = await phpFetch("vehicle/create", info)
            if (!data) throw new Error("Erreur serveur !")
            return data
        } catch (e) {
            console.error("Erreur : ", e);
        }

    }

    async updateVehicule(info) {
        try {
            const data = await phpFetch("vehicle/update", info)
            if (!data) throw new Error("Erreur serveur !")
            return data
        } catch (e) {
            console.error("Erreur : ", e);
        }

    }
}