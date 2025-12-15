import { UI } from "./UI.js";

export class User {
    static instance = null;

    static init() {
        if (!User.instance) User.instance = new User();
        this.token = localStorage.getItem("userSession");

        if (!this.token) UI.toggleAuth(true);
        return User.instance;
    }

    static getInstance() {
        if (!User.instance) throw new Error("User non init !");
        return User.instance;
    }

    constructor() {
        if (User.instance)
            throw new Error("User déjà init !");
        this.nom = null
        this.prenom = null
        this.num = null
        this.mail = null
        this.token = null;
    }
}