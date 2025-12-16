import { phpFetch } from "../../controller/js/phpInteraction.js";
import { UI } from "./UI.js";

export class User {
    static instance = null;

    static async init() {
        if (!User.instance) User.instance = new User();
        User.instance.isLogged = await User.instance.checkAuth();
        return User.instance;
    }

    static getInstance() {
        if (!User.instance) throw new Error("User non init !");
        return User.instance;
    }

    constructor() {
        if (User.instance)
            throw new Error("User déjà init !");
        this.isLogged = false
        this.createAccount = false;
        this.userId = null;
        this.mail = null;
    }

    async checkAuth() {
        try {
            const data = await phpFetch("checkAuth.php", {}, {
                credentials: "include"
            });
            if (!data) throw new Error("Erreur serveur !");

            if (!data.authenticated) UI.toggleAuth(true);
            if (data.authenticated) {
                UI.toggleAuthIcon(true)
                this.userId = data.user_id;
                this.mail = data.mail;
            };
            return data.authenticated ? data.authenticated : false;

        } catch (error) {
            console.error("checkAuth error: ", error);
            return false;
        }
    }

    async load(id) {
        try {
            const data = await phpFetch("loadInfo.php", { id: id })
            if (!data) throw new Error("Erreur serveur !");
            else return data
        } catch (error) {
            console.error("Load info error: ", error)
            return null
        }
    }

    async login(mail, password) {
        const data = await phpFetch("login.php", { mail, password }, {
            credentials: "include",
        });

        if (data.status === "success") {
            UI.toggleAuth(false);
            UI.toggleAuthIcon(true);
            this.isLogged = true;
            this.userId = data.user_id;
            this.mail = data.mail;
        }
        else {
            throw new Error("Erreur serveur : " + data.message);
        }

        return data
    }

    async signin(info) {
        const data = await phpFetch("signin.php", info, {
            credentials: "include",
        });

        if (data.status === "success") {
            await this.login(info.mail, info.password)
            this.createAccount = false
        }
        else {
            throw new Error("Erreur serveur : " + data.message);
        }

        return data
    }

    async logout() {
        const data = await phpFetch("logout.php", {}, {
            credentials: "include",
        })

        if (data.status === "success") {
            this.isLogged = false;
            this.mail = null;
            this.userId = null;
            UI.toggleAuthIcon(false);
            UI.toggleSetting(false);
        } else {
            throw new Error("Erreur serveur : " + data.message)
        }

        return data
    }

    async auth(info) {
        try {
            const { name, surname, tel, mail, password } = info
            let data;
            if (!mail || !password) {
                throw new Error("Password et mail requis pour la connections")
            }
            if (this.createAccount) {
                if (!name || !surname || !tel) throw new Error("Des informations requises sont manquantes ! ")
                data = await this.signin(info);
            } else {
                data = await this.login(mail, password);
            }
            return data
        } catch (error) {
            alert("Une Erreur s'est produites, Veuillez réessayer !")
            console.log(error)
            return null
        }
    }
}