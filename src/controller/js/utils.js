//Class avec des fct utiles
export class Utils {
    static isEmpty = (value) => !value || value.trim() === "";

    static isValidEmail = (email) => //Chaine valide pour les mails
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    static isValidString = (string) => //Chaine valide pour les nom etc
        /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string);

    static isValidNumber = (string) => //Accepte float
        /^\d+(\.\d+)?$/.test(string);

    static isValidPositiveNumber = (string) => //Entier positif non nul
        /^[1-9]\d*$/.test(string);

    static isValidPhone = (phone) => //Format numéro de tel
        /^[0-9]{8,15}$/.test(phone);

    static isValidPlate = (plate) => //Format global plaque
        /^[A-Z0-9]{1,4}([ -]?[A-Z0-9]{1,4}){1,3}$/.test(plate);

    static distIcon = "https://cdn-icons-png.flaticon.com/512/4668/4668400.png" //Icon destination
    static carIcon = "https://cdn-icons-png.flaticon.com/512/5193/5193688.png"  //Icon de la voiture

    static coordEqual(a, b) {
        if (a === b) return true;

        if (typeof a !== "object" || typeof b !== "object" || a === null || b === null)
            return false;
        if (!a.lat || !a.lng || !b.lat || !b.lng) return false;
        if (a.lat !== b.lat) return false;
        if (a.lng !== b.lng) return false;
        return true;
    }

}