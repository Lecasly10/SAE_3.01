import * as element from "./htmlElement.js";

export function toggleNavigationUI(destinationName) {
  element.homeIcon.style.display = "none";
  element.crossIcon.style.display = "block";
  element.autoSearchButton.style.display = "none";

  element.resultContainer.style.visibility = "hidden";

  element.searchBar.style.display = "none";
  element.listButton.style.display = "none";

  element.topnav.style.justifyContent = "center";

  element.itiniraireTitle.style.display = "block";
  element.itiniraireTitle.textContent = destinationName;
}

export function setupUI() {
  element.topnav.style.justifyContent = "space-arround";

  element.itiniraireTitle.style.display = "none";
  element.searchBar.style.display = "flex";
  element.listButton.style.display = "flex";
  element.homeIcon.style.display = "block";
  element.crossIcon.style.display = "none";
  element.loader.style.display = "none";
  element.autoSearchButton.style.display = "block";

  element.resultContainer.style.visibility = "hidden";
}
