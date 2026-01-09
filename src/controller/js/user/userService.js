import { User } from "./user.js";
import { AuthError } from "../errors/errors.js";

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
        const { name, surname, tel, mail, password } = info;

        if (!mail || !password) {
            throw new AuthError("Mail et mot de passe requis");
        }

        if (this.createAccount) {
            if (!name || !surname || !tel) {
                throw new AuthError("Informations manquantes pour la création du compte");
            }
            return this.signin(info);
        }

        return this.login(mail, password);
    }

    async checkAuth() {
        try {
            const sessionData = await this.apiService.phpFetch(
                "user/session",
                {},
                { credentials: "include" }
            );

            if (sessionData.data.authenticated) {
                this.user.userId = sessionData.data.user_id;
                this.user.mail = sessionData.data.mail;
                return true;
            }

            return false;
        } catch {
            return false;
        }
    }

    async load() {
        const loadData = await this.apiService.phpFetch(
            "user/load",
            { id: this.user.userId }
        );

        return loadData;
    }

    async update(info) {
        return this.apiService.phpFetch(
            "user/update",
            info
        );
    }

    async login(mail, password) {
        const loginData = await this.apiService.phpFetch(
            "user/login",
            { mail, password },
            { credentials: "include" }
        );

        this.user.isLogged = true;
        this.user.userId = loginData.data.user_id;
        this.user.mail = loginData.data.mail;

        return loginData;
    }

    async signin(info) {
        const signinData = await this.apiService.phpFetch(
            "user/signin",
            info,
            { credentials: "include" }
        );

        await this.login(info.mail, info.password);
        this.createAccount = false;

        return signinData;
    }

    async logout() {
        const logoutData = await this.apiService.phpFetch(
            "user/logout",
            {},
            { credentials: "include" }
        );

        this.user.reset();

        return logoutData;
    }
}
