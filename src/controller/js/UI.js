import * as element from "./htmlElement.js";

export function toggleNavigationUI(destinationName) {
  element.homeIcon.style.display = "none";
  element.crossIcon.style.display = "block";
  element.resultContainer.style.visibility = "hidden";
  element.autoSearchButton.style.display = "none";

  element.searchBar.style.display = "none";
  element.listButton.style.display = "none";

  element.topnav.style.justifyContent = "center";

  element.itiniraireTitle.style.display = "block";
  element.itiniraireTitle.textContent = destinationName;
}

export function setupUI() {
  element.homeIcon.style.display = "block";
  element.crossIcon.style.display = "none";
  element.topnav.style.justifyContent = "space-arround";

  element.itiniraireTitle.style.display = "none";
  element.searchBar.style.display = "flex";
  element.listButton.style.display = "flex";

  element.autoSearchButton.style.display = "block";

  toggleLoader(false);
  element.resultContainer.style.visibility = "hidden";
  emptyResultBox();
}

export function emptyResultBox() {
  if (element.resultBox.innerHTML !== "") {
    element.resultBox.innerHTML = "";
  }
}

export function emptySearchBox() {
  if (element.searchBox.value !== "") {
    element.searchBox.value = "";
  }
}

export function setResultMessage(message) {
  const text = document.createElement("p");
  text.textContent = message;
  element.resultBox.appendChild(text);
}

export function setResultTitle(title) {
  element.resultTitle.textContent = title;
}

export function toggleLoader(arg = false) {
  const loader = element.loader;
  if (arg) {
    loader.style.display = "block";
  } else {
    loader.style.display = "none";
  }
}

export function createText(title, text) {
  const container = document.createElement("div");
  const content = document.createElement("p");
  const titleContent = document.createElement("p");

  container.style.display = "flex";
  container.style.flexDirection = "row";

  content.classList = "item infoitem";
  titleContent.classList = "item infoitem";
  titleContent.textContent = title;
  titleContent.style.fontWeight = "bold";
  content.textContent = text;
  content.style.paddingLeft = "5px";

  container.appendChild(titleContent);
  container.appendChild(content);

  return container;
}

export function appendTextElements(container, items) {
  items.forEach(([label, value]) =>
    container.appendChild(createText(`${label} :`, value))
  );
  container.appendChild(document.createElement("hr"));
}
