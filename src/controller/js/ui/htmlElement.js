function get(id) {
    return document.getElementById(id);
};

const notification = {
    notifContainer: get("notif"),
    notifTitle: get("notifTitle"),
    notifContent: get("notifContent"),
}

const bottomBar = {
    homeButton: get("homeButton"),
    stopButton: get("stopButton"),
    centerButton: get("centerButton"),
    closestParkingButton: get("autoSearchButton"),
    userIcon: get("userIcon"),
    settingsButton: get("settingsButton"),
};

const topBar = {
    loader: get("loader"),
    topBarContainer: get("topnav"),
    searchBox: get("searchbox"),
    searchContainer: get("search-bar"),
    barTitle: get("itiniraireTitle"),
    parkingListButton: get("listButton"),
};

const resultsPopup = {
    resultBox: get("resultBox"),
    resultContainer: get("resultContainer"),
    resultTitle: get("resultTitle"),
    closeResultButton: get("closeButton"),
};

const authPopup = {
    authContainer: get("auth"),
    additionalInfo: get("preinfo"),
    signInLink: get("inscription"),
    logInLink: get("connexionLink"),
    nameInput: get("name"),
    telInput: get("tel"),
    surnameInput: get("surname"),
    passwordInput: get("password"),
    confirmPasswordInput: get("confirmpasswordbox"),
    mailInput: get("mail"),
    submitAuthButton: get("submit"),
    errorTextAuth: get("errorAuth"),
    closeAuthButton: get("closeAuthButton"),
};

const settingsPopup = {
    settingsContainer: get("settings"),
    settingsNameInput: get("nameParam"),
    settingsSurnameInput: get("surnameParam"),
    settingsNameInput: get("mailParam"),
    settingsTelInput: get("telParam"),
    freeParkingCheck: get("freeParam"),
    settingsVehiculesList: get("carParam"),
    closeSettingsButton: get("closeSettingButton"),
    coveredParkCheck: get("coverParam"),
    pmrParkCheck: get("pmrParam"),
    maxDistanceInput: get("distParam"),
    maxHourlyBudgetInput: get("budgetParam"),
    logoutButton: get("logout"),
    errorTextSettings: get("errorSett"),
    submitSettingsButton: get("submitsett"),
    vehiculeButton: get("carButton"),
}

const vehiculePopup = {
    vehiculeContainer: get("voiture"),
    vehiculeList: get("carTab"),
    deleteCarButton: get("deleteCar"),
    addCarButton: get("addCar"),
    editCarButton: get("editCar"),
    closeVehiculeButton: get("closeVoitButton"),
}

const vehiculeEditPopup = {
    vehiculeEditContainer: get("voitureEdit"),
    vehiculeEditContainerTitle: get("editTitle"),
    errorTextVehicule: get("errorVoitEdit"),
    vehiculePlateInput: get("plateParam"),
    vehiculeHeightInput: get("vHeightParam"),
    vehiculeTypeInput: get("vTypeParam"),
    vehiculeMotorInput: get("vMotorParam"),
    closeVehiculeEditButton: get("closeVoitEdit"),
    submitVehiculeButton: get("submitEditCar"),
}

export const elements =
    { bottomBar, topBar, resultsPopup, authPopup, notification, settingsPopup, vehiculePopup, vehiculeEditPopup };



















export const homeIcon = document.getElementById("homeButton"); //Bouton home
export const crossIcon = document.getElementById("stopButton"); //Bouton pour annuler / stop
export const goCenterButton = document.getElementById("centerButton"); //Bouton pour recentrer
export const autoSearchButton = document.getElementById("autoSearchButton"); //Bouton pour trouver le partking le plus proche
export const userIcon = document.getElementById("userIcon")

//Top Bar
export const topnav = document.getElementById("topnav"); //Topbar
export const searchBox = document.getElementById("searchbox"); // searchbox
export const searchBar = document.getElementById("search-bar"); // searchbar
export const itiniraireTitle = document.getElementById("itiniraireTitle"); // Itiniraire / loading
export const listButton = document.getElementById("listButton"); // Bouton pour lister les parkings
export const settingsButton = document.getElementById("settingsButton");
export const closeAuthButton = document.getElementById("closeAuthButton");

//results
export const resultContainer = document.getElementById("resultContainer");
export const resultBox = document.getElementById("resultBox");
export const resultTitle = document.getElementById("resultTitle");
export const closeButton = document.getElementById("closeButton");

//Connection / inscription
export const auth = document.getElementById("auth");
export const preInfo = document.getElementById("preinfo");
export const inscrLink = document.getElementById("inscription");
export const connLink = document.getElementById("connexionLink");
export const nameI = document.getElementById("name");
export const telI = document.getElementById("tel");
export const surnameI = document.getElementById("surname");
export const pass = document.getElementById("password");
export const mail = document.getElementById("mail");
export const confPass = document.getElementById("confirmpasswordbox");
export const submitButton = document.getElementById("submit");
export const errorI = document.getElementById("errorAuth");

//Settings
export const settings = document.getElementById("settings");
export const settingContainer = document.getElementById("settingContainer");
export const nameParam = document.getElementById("nameParam");
export const surnameParam = document.getElementById("surnameParam");
export const mailParam = document.getElementById("mailParam");
export const telParam = document.getElementById("telParam");
export const closeSettingButton = document.getElementById("closeSettingButton");

export const freeParam = document.getElementById("freeParam");
export const carParam = document.getElementById("carParam");
export const coverParam = document.getElementById("coverParam");
export const pmrParam = document.getElementById("pmrParam");
export const maxDistParam = document.getElementById("distParam");
export const maxHBudgetParam = document.getElementById("budgetParam");
export const logoutButton = document.getElementById("logout");
export const errorS = document.getElementById("errorSett");
export const submitSett = document.getElementById("submitSett");

export const editTitle = document.getElementById("editTitle")
export const plateParam = document.getElementById("plateParam")
export const vHeightParam = document.getElementById("vHeightParam")
export const vTypeParam = document.getElementById("vTypeParam")
export const vMotorParam = document.getElementById("vMotorParam")

export const carButton = document.getElementById("carButton");
export const voitureDiv = document.getElementById("voiture");
export const voitureEditDiv = document.getElementById("voitureEdit");
export const deleteCar = document.getElementById("deleteCar");
export const addCar = document.getElementById("addCar");
export const editCar = document.getElementById("editCar");
export const listvoit = document.getElementById("carTab");
export const submitEditCar = document.getElementById("submitEditCar");
export const closeEdit = document.getElementById("closeVoitEditButton");
export const closeVoit = document.getElementById("closeVoitButton");
export const errorV = document.getElementById("errorVoitEdit")

//loading animation
export const loader = document.getElementById("loader");

//notif
export const notif = document.getElementById("notif");
export const notifTitle = document.getElementById("notifTitle");
export const notifContent = document.getElementById("notifContent");