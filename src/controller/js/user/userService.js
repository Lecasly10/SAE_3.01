import { UI } from "../ui/UI.js";
import { User } from "./user.js";


export class UserService {
    constructor(api) {
        this.apiService = api;
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
            if (error instanceof Error)
                console.error("[ERREUR] UserService - auth : ", error);
            alert("Une Erreur s'est produite, Veuillez réessayer !");
        }
    }

    async checkAuth() {
        try {
            const sessionData = await this.apiService.phpFetch("user/session", {}, {
                credentials: "include"
            });

            if (!sessionData.success) return false
            if (sessionData.data.authenticated) {
                data = sessionData.data
                UI.toggleAuthIcon(true)
                this.user.userId = data.user_id;
                this.user.mail = data.mail;

                return data.authenticated;
            };

        } catch (error) {
            if (error instanceof Error)
                console.error("[ERREUR] UserService - checkAuth : ", error);
            alert("Une Erreur s'est produite !");
            return false;
        }
    }

    async update(info) {
        try {
            const updateData = await this.apiService.phpFetch("user/update", info)
            return updateData;
        } catch (error) {
            if (error instanceof Error)
                console.error("[ERREUR] UserService - update : ", error);
            alert("Une Erreur s'est produite, Veuillez réessayer !");
        }

    }

    async load() {
        try {
            const loadData = await this.apiService.phpFetch("user/load", { id: this.user.userId })
            if (!loadData.success) {
                if (loadData.error.code === "USER_NOT_FOUND") {
                    throw new Error("L'utilisateur n'a pas été retrouvé !");
                }
            }
            return loadData

        } catch (error) {
            if (error instanceof Error)
                console.error("[ERREUR] UserService - load : ", error);
            alert("Une Erreur s'est produite, Veuillez réessayer !");
        }
    }

    async login(mail, password) {
        try {
            const loginData = await this.apiService.phpFetch("user/login", { mail, password }, {
                credentials: "include",
            });

            if (loginData.success) {
                UI.toggleAuth(false)
                UI.notify("Compte", "Connexion réussi !")
                UI.toggleAuthIcon(true);
                this.user.isLogged = true;
                this.user.userId = loginData.user_id;
                this.user.mail = loginData.mail;
            }

            return loginData
        } catch (error) {
            if (error instanceof Error)
                console.error("[ERREUR] UserService - login : ", error);
            alert("Une Erreur s'est produite, Veuillez réessayer !");
        }
    }

    async signin(info) {
        try {
            const signinData = await this.apiService.phpFetch("user/signin", info, {
                credentials: "include",
            });

            if (signinData.success) {
                await this.login(info.mail, info.password)
                this.createAccount = false
            }

            return signinData
        } catch (error) {
            if (error instanceof Error)
                console.error("[ERREUR] UserService - signin : ", error);
            alert("Une Erreur s'est produite, Veuillez réessayer !");
        }
    }

    async logout() {
        try {
            const logoutData = await this.apiService.phpFetch("user/logout", {}, {
                credentials: "include",
            })

            if (logoutData.success) {
                this.user.reset();
                UI.toggleAuthIcon(false);
                UI.toggleSetting(false);
            }

            return logoutData
        } catch (error) {
            if (error instanceof Error)
                console.error("[ERREUR] UserService - logout : ", error);
            alert("Une Erreur s'est produite, Veuillez réessayer !");
        }
    }
}