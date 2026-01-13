import { elements } from "./htmlElement.js"

export class UI {
  // HTML
  static el = elements;
  static timeoutId = null;

  static show(element) {
    element.classList.remove("hidden");
  }
  static hide(element) {
    element.classList.add("hidden");
  }
  static visible(element) {
    element.style.visibility = "visible";
  }
  static invisible(element) {
    element.style.visibility = "hidden";
  }

  static async notify(title, message, overlay = false, time = 5) {
    let { notifContainer, notifTitle, notifContent } = UI.el.notification;

    if (UI.timeoutId) {
      clearTimeout(UI.timeoutId);
      notifContainer.classList.remove("hide");
      notifContainer.classList.add("active");
    }

    overlay ? notif.classList.add("fullbg") : notif.classList.remove("fullbg")

    notifTitle.textContent = title === "" ? "SmartParking" : title;
    notifContent.textContent = message;
    notif.classList.remove("hidden", "hide");
    notif.classList.add("active");

    UI.timeoutId = setTimeout(() => {
      notif.classList.remove("active");
      notif.classList.add("hide");
      UI.timeoutId = null;
    }, time * 1000);
  }


  static setupUI(load = false) {
    UI.el.topBar.topBarContainer.style.justifyContent = "space-around";

    UI.toggleSearchInput(true);
    UI.switchHomeCrossIcon(true);
    UI.show(UI.el.bottomBar.settingsButton);
    UI.hide(UI.el.resultsPopup.resultContainer);
    UI.emptyResultBox();
    if (!load) UI.hide(UI.el.topBar.loader);
  }

  static toggleNavigationUI(destinationName) {
    UI.switchHomeCrossIcon(false);
    UI.hide(UI.el.bottomBar.settingsButton);
    UI.hide(UI.el.resultsPopup.resultContainer);
    UI.toggleSearchInput(false);

    UI.el.topBar.topBarContainer.style.justifyContent = "center";
    UI.el.topBar.barTitle.textContent = destinationName;
  }

  static startDestinationPreview(destination) {
    UI.setupUI();
    UI.emptyResultBox();

    UI.setResultTitle(destination.name);
    UI.setResultMessage("Voulez vous aller à ce parking ?");

    const container = document.createElement("div");
    container.className = "dialog";

    const confirm = document.createElement("a");
    confirm.className = "button fade";
    confirm.textContent = "Confirmer";

    const cancel = document.createElement("a");
    cancel.className = "button";
    cancel.textContent = "Annuler";

    container.append(confirm, cancel);
    UI.appendResultBox(container);
    UI.show(UI.el.resultsPopup.resultContainer);

    return { confirm, cancel };
  }

  static resetCarEditList() {
    const { vehiculeList } = UI.el.vehiculePopup;
    vehiculeList.innerHTML = "";
    vehiculeList.add(new Option("Sélectionner un véhicule", "none", true, true));
  }

  static resetCarSettList() {
    const { settingsVehiculesList } = UI.el.settingsPopup;
    settingsVehiculesList.innerHTML = "";
    settingsVehiculesList.add(new Option("Aucun", "none", true, true));
  }

  static switchToLoggedIcon() {
    const { userIcon } = UI.el.bottomBar

    userIcon.classList.add("fa-user-circle-o")
    userIcon.classList.remove("fa-user-plus")
  }

  static switchToLoginIcon() {
    const { userIcon } = UI.el.bottomBar

    userIcon.classList.remove("fa-user-circle-o")
    userIcon.classList.add("fa-user-plus")
  }

  static toggleInsc(show = false) {
    const { additionalInfo, logInLink, signInLink, confirmPasswordInput, errorTextAuth, telInput } = UI.el.authPopup
    UI.hide(errorTextAuth);
    if (show) {
      UI.show(additionalInfo);
      UI.show(telInput);
      UI.show(logInLink);
      UI.show(confirmPasswordInput);
      UI.hide(signInLink);
    } else {
      UI.hide(additionalInfo);
      UI.hide(telInput);
      UI.hide(logInLink);
      UI.hide(confirmPasswordInput);
      UI.show(signInLink);
    }
  }

  static toggleSearchInput(showInput = false) {
    const { barTitle, searchContainer, listButton } = UI.el.topBar;
    const { closestParkingButton } = UI.el.bottomBar;
    if (showInput) {
      UI.hide(barTitle);
      UI.show(closestParkingButton);
      UI.show(searchContainer);
      UI.show(listButton);
    } else {
      UI.show(barTitle);
      UI.hide(closestParkingButton);
      UI.hide(searchContainer);
      UI.hide(listButton);
    }
  }

  static switchHomeCrossIcon(showHome = false) {
    const { homeButton, stopButton } = UI.el.bottomBar;

    if (showHome) {
      UI.show(homeButton);
      UI.hide(stopButton);
    } else {
      UI.hide(homeButton);
      UI.show(stopButton);
    }
  }

  static toggleLoader(showLoader = false) {
    showLoader ? UI.show(UI.el.topBar.loader) : UI.hide(UI.el.topBar.loader);
  }

  static emptyResultBox() {
    UI.el.resultsPopup.resultBox.innerHTML = "";
  }

  static appendResultBox(htmlElement) {
    UI.el.resultsPopup.resultBox.appendChild(htmlElement);
  }

  static setResultMessage(message) {
    const text = document.createElement("p");
    text.textContent = message;
    UI.appendResultBox(text);
  }

  static setResultTitle(title) {
    UI.el.resultsPopup.resultTitle.textContent = title;
  }

  static getSearchQuery() {
    return UI.el.topBar.searchBox.value;
  }

  static emptySearchBox() {
    UI.el.topBar.searchBox.value = "";
  }

  static createText(title, text) {
    const container = document.createElement("div");
    container.className = "divInfo";

    const titleContent = document.createElement("p");
    titleContent.className = "item bold";
    titleContent.textContent = title;

    const content = document.createElement("p");
    content.className = "item";
    content.textContent = text;

    container.append(titleContent, content);
    return container;
  }

  static appendTextElements(container, items) {
    items.forEach(([label, value]) => {
      container.append(UI.createText(`${label} :`, value));
    });
    container.append(document.createElement("hr"));
  }
}
