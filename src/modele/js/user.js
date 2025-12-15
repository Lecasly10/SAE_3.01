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
        this.nom = null
        this.prenom = null
        this.num = null
        this.mail = null
        this.token = null;
        this.createAccount = false;
    }

    async checkAuth() {
        try {
            const data = await phpFetch("checkAuth.php", {}, {
                credentials: "include"
            });

            if (!data) throw new Error("Erreur serveur !");


            if (!data.authenticated) UI.toggleAuth(true);
            return data.authenticated ? data.authenticated : false;

        } catch (error) {
            console.error("checkAuth error:", error);
            return false;
        }
    }

    async login(mail, password) {
        const data = await phpFetch("login.php", { mail, password }, {
            credentials: "include",
        });

        if (data.status === "success") console.log("connecté !");
        else {
            console.log("Erreur : " + data.message);
        }
    }

    async signin(info) {
        const data = await phpFetch("signin.php", info, {
            credentials: "include",
        });

        if (data.status === "success") console.log("Compte créer et connecté");
        else {
            console.log("Erreur : " + data.message);
        }
    }

    async auth(info) {
        try {
            const { name, surname, tel, mail, password } = info
            if (!mail || !password) {
                throw new Error("Password et mail requis pour la connections")
            }
            if (this.createAccount) {
                if (!name || !surname || !tel) throw new Error("Des informations requises sont manquantes ! ")
                await this.signin(info);
            } else {
                await this.login(mail, password);
            }
        } catch (error) {
            alert("Une Erreur s'est produites, Veuillez réessayer !")
            console.log(error)
        }
    }
}