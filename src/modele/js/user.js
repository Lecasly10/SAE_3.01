import { phpFetch } from "../../controller/js/phpInteraction.js";
import { UI } from "./UI.js";

export class User {
    static instance = null;

    static init() {
        if (!User.instance) User.instance = new User();
        User.instance.isLogged = User.instance.checkAuth();
        console.log(User.instance.isLogged)
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
        await fetch("checkAuth.php", {
            credentials: "include"
        })
            .then(r => r.json())
            .then(data => {
                if (!data) throw new Error("Erreur serveur !")
                if (data.authenticated) {
                    return true
                }
                UI.toggleAuth(true);
                return false
            });
    }

    async login(mail, password) {
        await fetch("login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ mail, password })
        })
            .then(r => r.json())
            .then(data => {
                if (!data) throw new Error("Erreur serveur !")
                if (data.success) {
                    console.log("Connecté !")
                } else {
                    console.log("Fail !")
                }
            })
    }

    async signin(info) {
        const req = await phpFetch("", info)
    }

    async auth(info) {
        try {
            const { name, surname, tel, mail, password } = info
            if (!mail || !password) {
                throw new Error("Password et mail requis pour la connections")
            }
            if (this.createAccount) {
                if (!name || !surname || !tel) throw new Error("Des informations requises sont manquantes ! ")
                this.signin(info);
            } else {
                this.login({ mail, password });
            }
        } catch (error) {
            alert("Une Erreur s'est produites, Veuillez réessayer !")
            console.log(error)
        }
    }
}