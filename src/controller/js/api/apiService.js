export class ApiService {
    constructor() {
        this.googleLibs = {};
        this.server = `https://devweb.iutmetz.univ-lorraine.fr/~e58632u/sae3/src/controller/php/`
        this.defaultFetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    }

    async init() {
        await this.loadGoogleLibs();
    }

    async loadGoogleLibs() {
        const { Map } = await google.maps.importLibrary("maps");
        await google.maps.importLibrary("geometry");
        const { spherical } = await google.maps.importLibrary("geometry");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { ColorScheme } = await google.maps.importLibrary("core");
        const { Route } = await google.maps.importLibrary("routes");

        this.googleLibs = { Map, AdvancedMarkerElement, ColorScheme, Route, spherical };
    }

    async phpFetch(php, object, options = null) {
        let data = null;
        try {
            options = {
                body: JSON.stringify(object),
                ...this.defaultFetchOptions,
                ...options
            }

            const resp = await fetch(`${this.server}${php}.php`, options);
            if (!resp.ok) throw new Error(`HTTP : (${resp.status})`);

            data = await resp.json();
            if (!data) throw new Error(`JSON Vide`)

        } catch (erreur) {
            if (erreur instanceof Error) {
                console.log("[ERREUR] ApiService : ", erreur);
            }
        } finally {
            return data;
        }
    }
}