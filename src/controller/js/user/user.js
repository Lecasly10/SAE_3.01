export class User {
    constructor() {
        this.isLogged = false
        this.userId = null;
        this.mail = null;
    }

    reset() {
        this.email = null;
        this.userId = null;
        this.isLogged = false;
    }

}