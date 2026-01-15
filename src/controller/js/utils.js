//Class avec des fct utiles
export class Utils {
    static distIcon = "https://cdn-icons-png.flaticon.com/512/4668/4668400.png" //Icon destination
    static carIcon = "https://cdn-icons-png.flaticon.com/512/5193/5193688.png"  //Icon de la voiture
    static parkIcon = "https://cdn-icons-png.flaticon.com/512/4842/4842406.png" // Icon parking

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

    static isCoordObjectEqual(coordObject1, coordObject2) {
        if (coordObject1 === coordObject2) return true;

        if (typeof coordObject1 !== "object" || typeof coordObject2 !== "object" || coordObject1 === null || coordObject2 === null)
            return false;
        if (!coordObject1.lat || !coordObject1.lng || !coordObject2.lat || !coordObject2.lng) return false;
        if (coordObject1.lat !== coordObject2.lat) return false;
        if (coordObject1.lng !== coordObject2.lng) return false;
        return true;
    }

}