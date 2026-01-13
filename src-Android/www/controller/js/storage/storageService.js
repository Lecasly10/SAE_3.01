import { AppError } from "../errors/errors.js";

export class StorageService {
    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            throw new AppError("La suppression dans localStorage a échoué !");
        }
    }


    static set(key, object) {
        let value;
        try {
            value = JSON.stringify(object);
            localStorage.setItem(key, value);
        } catch (error) {
            throw new AppError("Impossible d'ajouter l'objet dans localStorage !");
        }
        return object;
    }


    static getToJson(key, defaultValue = null) {
        const data = localStorage.getItem(key);
        if (!data) return defaultValue;
        try {
            return JSON.parse(data);
        } catch (error) {
            throw new AppError("Le JSON est invalide !")
        }
    }
}