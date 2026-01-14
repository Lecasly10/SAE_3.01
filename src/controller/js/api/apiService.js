import { AppError, ApiError, AuthError } from "../errors/errors.js";

export class ApiService {
    constructor() {
        this.googleLibs = {};
        this.baseUrl = `https://devweb.iutmetz.univ-lorraine.fr/~e58632u/sae3/src/controller/php/`
    }

    async loadGoogleLibs() {
        const { Map } = await google.maps.importLibrary("maps");
        await google.maps.importLibrary("geometry");
        const { spherical } = await google.maps.importLibrary("geometry");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { ColorScheme } = await google.maps.importLibrary("core");
        const { Route } = await google.maps.importLibrary("routes");

        this.googleLibs = { Map, AdvancedMarkerElement, ColorScheme, Route, spherical };

        if (!Object.entries(this.googleLibs).length) throw new ApiError("Le chargement des librairies google map à échoué");
    }

    async phpFetch(endpoint, data = {}, options = {}) {
        let response;

        try {
            response = await fetch(this.baseUrl + endpoint + '.php', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                ...options,
            });
        } catch (networkError) {
            console.error("[ApiService][Network]", networkError);
            throw new ApiError("Impossible de contacter le serveur");
        }

        if (!response.ok) {
            if (response.status === 401 || response.status === 403)
                throw new AuthError("Session expirée ou accès refusé");

            throw new ApiError(
                `Erreur HTTP ${response.status}`,
                response.status
            );
        }

        let json;
        try {
            json = await response.json();
        } catch {
            throw new ApiError("Réponse serveur invalide");
        }


        if (!json.success) {
            if (json.error?.code === "UNAUTHORIZED") {
                throw new AuthError(json.error.message);
            }

            throw new AppError(
                json.error?.message || "Erreur serveur",
                json.error?.code
            );
        }

        return json;
    }
}