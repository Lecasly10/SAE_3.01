//Class avec des fct utiles
export class Utils {
    static isEmpty = (value) => !value || value.trim() === "";

    static isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    static isValidString = (string) =>
        /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string);

    static isValidNumber = (string) =>
        /^\d+(\.\d+)?$/.test(string);

    static isValidPhone = (phone) =>
        /^[0-9]{8,15}$/.test(phone);

    static distIcon = "https://cdn-icons-png.flaticon.com/512/4668/4668400.png"
    static carIcon = "https://cdn-icons-png.flaticon.com/512/5193/5193688.png"
}