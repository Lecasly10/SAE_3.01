export class Utils {
    static isEmpty = (value) => !value || value.trim() === "";

    static isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    static isValidString = (string) =>
        /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)

    static isValidPhone = (phone) =>
        /^[0-9]{8,15}$/.test(phone);
}