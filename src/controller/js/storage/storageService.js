export class StorageService {
    static remove(key) {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
        }
    }

    static set(key, object) {
        try {
            const value = JSON.stringify(object);
            localStorage.setItem(key, value);
        } catch (e) {
            if (e instanceof Error) {
                console.error("[ERREUR] StorageService - set : ", e)
                this.remove(key);
                return
            }
        }

        return object
    }

    static getToJson(key) {
        const data = localStorage.getItem(key);
        const res = null;
        try {
            if (data) {
                res = JSON.parse(data);
            }
        } catch (e) {
            if (e instanceof Error) console.error("[ERREUR] StorageService - getToJson : ", e);
            this.remove(key);
        }

        return res;
    }
}