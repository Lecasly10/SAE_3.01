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
    settingsMailInput: get("mailParam"),
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
    deleteVehiculeButton: get("deleteCar"),
    addVehiculeButton: get("addCar"),
    editVehiculeButton: get("editCar"),
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
    closeVehiculeEditButton: get("closeVoitEditButton"),
    submitVehiculeButton: get("submitEditCar"),
}

export const elements =
{
    bottomBar, topBar, resultsPopup, authPopup,
    notification, settingsPopup,
    vehiculePopup, vehiculeEditPopup
};
