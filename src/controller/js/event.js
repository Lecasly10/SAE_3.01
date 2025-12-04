import * as element from "./htmlElement.js";
import * as handler from "./eventHandler.js";
import { builder } from "../../modele/js/builder.js";

export async function initEvent() {
  //Recentrer
  element.goCenterButton.addEventListener("click", () => {
    builder.map.panTo(userMarker.position);
  });

  //Rechercher le parking le plus proche
  element.autoSearchButton.addEventListener("click", (e) => {
    handler.handleAutoSearchClick(e);
  });

  //Rechercher parkings
  element.searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      handler.handleSearchBoxSubmit(e);
    }
  });

  //Lister les parkings
  element.listButton.addEventListener("click", async (e) => {
    handler.handleListButton(e);
  });

  //Annuler ou stop
  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      handler.handleCrossIcon(e);
    });
  }

  //Fermer les box
  if (element.closeButton) {
    element.closeButton.addEventListener("click", (e) => {
      handler.handleCloseButton(e);
    });
  }
}
