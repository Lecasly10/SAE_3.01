import * as element from "../htmlElement.js";

export class UI {
  // HTML
  static el = element;

  static show(el) {
    el.classList.remove("hidden");
  }
  static hide(el) {
    el.classList.add("hidden");
  }
  static visible(el) {
    el.style.visibility = "visible";
  }
  static invisible(el) {
    el.style.visibility = "hidden";
  }

  static setupUI() {
    UI.el.topnav.style.justifyContent = "space-around";

    UI.toggleSearchInput(true);
    UI.toggleHomeCrossIcon(true);
    UI.show(UI.el.settingsButton);
    UI.toggleLoader(false);
    UI.toggleResultContainer(false);
    UI.emptyResultBox();
  }

  static toggleNavigationUI(destinationName) {
    UI.toggleHomeCrossIcon(false);
    UI.hide(UI.el.settingsButton);
    UI.toggleResultContainer(false);
    UI.toggleSearchInput(false);

    UI.el.topnav.style.justifyContent = "center";
    UI.el.itiniraireTitle.textContent = destinationName;
  }

  static togglePreview(destination) {
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
    UI.toggleResultContainer(true);

    return { confirm, cancel };
  }

  static toggleAuth(show = false) {
    const { auth } = UI.el

    show ? UI.show(auth) : UI.hide(auth)
  }

  static toggleSetting(show = false) {
    const { settings, carParam } = UI.el
    if (!show) {
      carParam.innerHTML = "";
      carParam.add(new Option("Aucun", "none"))
    }
    show ? UI.show(settings) : UI.hide(settings);
  }

  static toggleVoiture(show = false) {
    const { voitureDiv, listvoit } = UI.el
    if (!show) {
      listvoit.innerHTML = "";
      listvoit.add(new Option("Sélectionner un véhicule", "none"))
    }
    show ? UI.show(voitureDiv) : UI.hide(voitureDiv)
  }

  static toggleVoitureEdit(show = false) {
    const { voitureEditDiv } = UI.el
    show ? UI.show(voitureEditDiv) : UI.hide(voitureEditDiv)
  }

  static toggleAuthIcon(show = false) {
    const { userIcon } = UI.el
    if (show) {
      userIcon.classList.add("fa-user-circle-o")
      userIcon.classList.remove("fa-user-plus")
    } else {
      userIcon.classList.remove("fa-user-circle-o")
      userIcon.classList.add("fa-user-plus")
    }

  }

  static toggleInsc(show = false) {
    const { preInfo, telI, inscrLink, connLink, confPass, errorI } = UI.el
    UI.hide(errorI)
    if (show) {
      UI.show(preInfo);
      UI.show(telI);
      UI.show(connLink);
      UI.show(confPass);
      UI.hide(inscrLink);
    } else {
      UI.hide(preInfo);
      UI.hide(telI);
      UI.hide(connLink);
      UI.hide(confPass);
      UI.show(inscrLink);
    }
  }

  static toggleSearchInput(showInput = false) {
    const { itiniraireTitle, autoSearchButton, searchBar, listButton } = UI.el;
    if (showInput) {
      UI.hide(itiniraireTitle);
      UI.show(autoSearchButton);
      UI.show(searchBar);
      UI.show(listButton);
    } else {
      UI.show(itiniraireTitle);
      UI.hide(autoSearchButton);
      UI.hide(searchBar);
      UI.hide(listButton);
    }
  }

  static toggleHomeCrossIcon(showHome = false) {
    const { homeIcon, crossIcon } = UI.el;

    if (showHome) {
      UI.show(homeIcon);
      UI.hide(crossIcon);
    } else {
      UI.hide(homeIcon);
      UI.show(crossIcon);
    }
  }

  static toggleResultContainer(showContainer = false) {
    showContainer
      ? UI.visible(UI.el.resultContainer)
      : UI.invisible(UI.el.resultContainer);
  }

  static toggleLoader(showLoader = false) {
    showLoader ? UI.show(UI.el.loader) : UI.hide(UI.el.loader);
  }

  static emptyResultBox() {
    UI.el.resultBox.innerHTML = "";
  }

  static appendResultBox(htmlElement) {
    UI.el.resultBox.appendChild(htmlElement);
  }

  static setResultMessage(message) {
    const text = document.createElement("p");
    text.textContent = message;
    UI.appendResultBox(text);
  }

  static setResultTitle(title) {
    UI.el.resultTitle.textContent = title;
  }

  static getSearchQuery() {
    return UI.el.searchBox.value;
  }

  static emptySearchBox() {
    UI.el.searchBox.value = "";
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
