import { AppError, ApiError, AuthError } from "../errors/errors.js";

export class ApiService {
    constructor() {
        this.googleLibs = {};
        this.baseUrl = `https://devweb.iutmetz.univ-lorraine.fr/~e58632u/sae3/src/controller/php/`
    }

    async loadGoogleLibs() {
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        await google.maps.importLibrary("geometry");
        const { spherical } = await google.maps.importLibrary("geometry");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { ColorScheme } = await google.maps.importLibrary("core");
        const { Route } = await google.maps.importLibrary("routes");

        this.googleLibs = { Map, InfoWindow, AdvancedMarkerElement, ColorScheme, Route, spherical };

        if (!Object.entries(this.googleLibs).length) throw new ApiError("Le chargement des librairies google map à échoué");
    }

    async phpFetch(endpoint, data = {}, options = {}) {
        const url = this.baseUrl + endpoint + '.php';
        return new Promise((resolve, reject) => {

            cordova.plugin.http.post(url, data, {
                'Content-Type': 'application/json'
            },

                (response) => {
                    try {
                        const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

                        if (!json.success) {
                            if (json.error?.code === "UNAUTHORIZED") {
                                reject(new AuthError(json.error.message));
                            } else {
                                reject(new AppError(json.error?.message || "Erreur serveur", json.error?.code));
                            }
                        } else {
                            resolve(json);
                        }
                    } catch (e) {
                        reject(new ApiError("Réponse serveur invalide"));
                    }
                },

                (error) => {
                    console.error("[ApiService][Network]", error);
                    reject(new ApiError("Impossible de contacter le serveur"));
                });
        });
    }
}