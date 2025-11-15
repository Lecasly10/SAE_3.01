import * as element from "./htmlElement.js";

function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}
function visible(el) {
  el.style.visibility = "visible";
}
function invisible(el) {
  el.style.visibility = "hidden";
}

export function toggleNavigationUI(destinationName) {
  toggleHomeCrossIcon(false);
  toggleResultContainer(false);
  toggleSearchInput(false);

  element.topnav.style.justifyContent = "center";
  element.itiniraireTitle.textContent = destinationName;
}

export function setupUI() {
  element.topnav.style.justifyContent = "space-around";

  toggleSearchInput(true);
  toggleHomeCrossIcon(true);
  toggleLoader(false);
  toggleResultContainer(false);
  emptyResultBox();
}

function toggleSearchInput(showInput = false) {
  const { itiniraireTitle, autoSearchButton, searchBar, listButton } = element;
  if (showInput) {
    hide(itiniraireTitle);
    show(autoSearchButton);
    show(searchBar);
    show(listButton);
  } else {
    show(itiniraireTitle);
    hide(autoSearchButton);
    hide(searchBar);
    hide(listButton);
  }
}

function toggleHomeCrossIcon(showHome = false) {
  const { homeIcon, crossIcon } = element;
  if (showHome) {
    show(homeIcon);
    hide(crossIcon);
  } else {
    hide(homeIcon);
    show(crossIcon);
  }
}

export function toggleResultContainer(showContainer = false) {
  const { resultContainer } = element;
  showContainer ? visible(resultContainer) : invisible(resultContainer);
}

export function toggleLoader(showLoader = false) {
  const { loader } = element;
  showLoader ? show(loader) : hide(loader);
}

export function emptyResultBox() {
  element.resultBox.innerHTML = "";
}

export function appendResultBox(htmlElement) {
  element.resultBox.appendChild(htmlElement);
}

//RESULT BOX MODIF
export function setResultMessage(message) {
  const text = document.createElement("p");
  text.textContent = message;
  appendResultBox(text);
}

export function setResultTitle(title) {
  element.resultTitle.textContent = title;
}

//CONFIRM BOX CONSTRUCTIONS
export function toggleConfirmBox() {
  const container = document.createElement("div");
  container.className = "dialog";

  const confirm = document.createElement("a");
  confirm.className = "button fade";
  confirm.textContent = "Confirmer";

  const cancel = document.createElement("a");
  cancel.className = "button";
  cancel.textContent = "Annuler";

  container.append(confirm, cancel);
  appendResultBox(container);
  toggleResultContainer(true);

  return { confirm, cancel };
}

export const getSearchQuery = () => element.searchBox.value;
export const emptySearchBox = () => (element.searchBox.value = "");

//PARKING INFO CONSTRUCTIONS
function createText(title, text) {
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

export function appendTextElements(container, items) {
  items.forEach(([label, value]) => {
    container.append(createText(`${label} :`, value));
  });
  container.append(document.createElement("hr"));
}
