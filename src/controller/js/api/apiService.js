export class ApiService {
    static googleLibs = {};
    static server = `https://devweb.iutmetz.univ-lorraine.fr/~e58632u/sae3/src/controller/php/`
    static defaultFetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }

    static async loadGoogleLibs() {
        const { Map } = await google.maps.importLibrary("maps");
        await google.maps.importLibrary("geometry");
        const { spherical } = await google.maps.importLibrary("geometry");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { ColorScheme } = await google.maps.importLibrary("core");
        const { Route } = await google.maps.importLibrary("routes");

        this.googleLibs = { Map, AdvancedMarkerElement, ColorScheme, Route, spherical };
    }

    static async phpFetch(php, data, options = null) {
        try {
            options = {
                body: JSON.stringify(data),
                ...this.defaultFetchOptions,
                ...options
            }

            const resp = await fetch(`${this.server}${php}.php`, options);

            if (!resp.ok) {
                throw new Error(`Erreur serveur (${resp.status})`);
            }

            const json = await resp.json();
            return json;
        } catch (erreur) {
            console.log("Erreur Serveur : ", erreur);
            return null;
        }
    }
}