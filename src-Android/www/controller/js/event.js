import * as element from "./htmlElement.js";
import * as handler from "./eventHandler.js";

export async function initEvent(builder) {
  const userMarker = builder.userMarker; //point sur la map ou se trouve l'utilisateur

  //Recentrer
  element.goCenterButton.addEventListener("click", () => {
    builder.map.panTo(userMarker.position);
  });

  //Rechercher le parking le plus proche
  element.autoSearchButton.addEventListener("click", (e) => {
    handler.handleAutoSearchClick(e, builder, userMarker);
  });

  //Rechercher parkings
  element.searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      handler.handleSearchBoxSubmit(e, builder, userMarker);
    }
  });

  //Lister les parkings
  element.listButton.addEventListener("click", async (e) => {
    handler.handleListButton(e, builder, userMarker);
  });

  //Annuler ou stop
  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      handler.handleCrossIcon(e, builder, userMarker);
    });
  }

  //Fermer les box
  if (element.closeButton) {
    element.closeButton.addEventListener("click", (e) => {
      handler.handleCloseButton(e, builder);
    });
  }
}
