import { phpFetch } from "../api/phpInteraction.js";
import { UI } from "../ui/UI.js";
import { User } from "./user.js";


export class UserService {
    constructor() {
        this.user = new User();
        this.createAccount = false;
    }

    async init() {
        this.user.isLogged = await this.checkAuth();
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
            alert("Une Erreur s'est produite, Veuillez réessayer !")
            console.error("Erreur : ", error)
        }
    }

    async checkAuth() {
        try {
            const data = await phpFetch("user/session", {}, {
                credentials: "include"
            });
            if (!data) throw new Error("Erreur serveur !");

            if (data.authenticated) {
                UI.toggleAuthIcon(true)
                this.user.userId = data.user_id;
                this.user.mail = data.mail;
            };

            return data.authenticated ? data.authenticated : false;

        } catch (error) {
            console.error("checkAuth error: ", error);
            return false;
        }
    }

    async update(info) {
        try {
            const data = await phpFetch("user/update", info)
            if (!data) throw new Error("Erreur serveur !")
            if (data.status === "success") UI.toggleSetting(false);
            return data
        } catch (error) {
            console.error("Update Error : ", error)
        }

    }

    async load() {
        try {
            const data = await phpFetch("user/load", { id: this.user.userId })
            if (!data) throw new Error("Erreur serveur !");
            else {
                return data
            }
        } catch (error) {
            console.error("Load info error: ", error)
        }
    }

    async login(mail, password) {
        const data = await phpFetch("user/login", { mail, password }, {
            credentials: "include",
        });

        if (data.status === "success") {
            UI.toggleAuth(false)
            UI.notify("Compte", "Connexion réussi !")
            UI.toggleAuthIcon(true);
            this.user.isLogged = true;
            this.user.userId = data.user_id;
            this.user.mail = data.mail;
        }

        return data
    }

    async signin(info) {
        const data = await phpFetch("user/signin", info, {
            credentials: "include",
        });

        if (data.status === "success") {
            await this.login(info.mail, info.password)
            this.createAccount = false
        }

        return data
    }

    async logout() {
        const data = await phpFetch("user/logout", {}, {
            credentials: "include",
        })

        if (data.status === "success") {
            this.user.reset();
            UI.toggleAuthIcon(false);
            UI.toggleSetting(false);
        }

        return data
    }
}