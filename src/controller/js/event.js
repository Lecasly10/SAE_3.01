import * as element from "./htmlElement.js";
import { MapBuilder } from "../../modele/js/builder.js";
import { Navigation } from "../../modele/js/navigation.js";
import { createHandlers } from "./eventHandler.js";

export async function initEvent() {
  const builder = MapBuilder.getInstance();
  const navigation = Navigation.getInstance();
  const handlers = createHandlers(builder, navigation);
  //Recentrer
  element.goCenterButton.addEventListener("click", () => {
    builder.map.panTo(builder.userMarker.position);
  });

  //Rechercher le parking le plus proche
  element.autoSearchButton.addEventListener("click", (e) => {
    handlers.handleAutoSearchClick(e);
  });

  //Rechercher parkings
  element.searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      handlers.handleSearchBoxSubmit(e);
    }
  });

  //Lister les parkings
  element.listButton.addEventListener("click", async (e) => {
    handlers.handleListButton(e);
  });

  //Annuler ou stop
  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      handlers.handleCrossIcon(e);
    });
  }

  //Fermer les box
  if (element.closeButton) {
    element.closeButton.addEventListener("click", (e) => {
      handlers.handleCloseButton(e);
    });
  }
}
