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
            if (!resp.ok && (resp.status !== 401 || resp.status !== 400)) throw new Error(`HTTP : (${resp.status})`);
            data = await resp.json();
            if (!data) throw new Error(`JSON Vide`)

            if (!data.success) {
                if (data.error.code === "INTERNAL_SERVER_ERROR"
                    || data.error.code === "MISSING_ARGUMENTS") {
                    throw new Error(data.error.message);
                }
            }

            if (!data.data) throw new Error(`Les données ne sont pas arrivées`)

        } catch (e) {
            if (e instanceof Error) {
                console.log("[ERREUR] ApiService - phpFetch : ", e);
            }
            alert("Une erreur s'est produite sur notre serveur, il est possible que le serveur soit injoignable")
        } finally {
            return data;
        }
    }
}