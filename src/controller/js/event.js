import * as element from "./htmlElement.js";
import { MapBuilder } from "../../modele/js/builder.js";
import { Navigation } from "../../modele/js/navigation.js";
import { User } from "../../modele/js/user.js";
import { createHandlers } from "./eventHandler.js";
import { UI } from "../../modele/js/UI.js";

export async function initEvent() {
  const builder = MapBuilder.getInstance();
  const navigation = Navigation.getInstance();
  const user = User.getInstance();
  const handlers = createHandlers(builder, navigation, user);
  //Recentrer
  element.goCenterButton.addEventListener("click", () => {
    builder.map.panTo(builder.userMarker.position);
  });

  element.settingsButton.addEventListener("click", (e) => {
    handlers.handleSettingButton(e);
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

  element.logoutButton.addEventListener("click", async (e) => {
    await user.logout();
  })

  element.submitButton.addEventListener("click", async (e) => {
    handlers.handleSubmit(e);
  })

  element.submitSett.addEventListener("click", async (e) => {
    handlers.handleUpdate(e)
  })

  element.carButton.addEventListener("click", async (e) => {
    UI.toggleVoiture(true);
  })

  element.addCar.addEventListener("click", async (e) => {
    UI.toggleVoitureEdit(true);
  })

  element.closeVoit.addEventListener("click", async (e) => {
    UI.toggleVoiture(false);
  })

  element.closeEdit.addEventListener("click", async (e) => {
    UI.toggleVoitureEdit(false);
  })

  element.listvoit.addEventListener("change", (e) => {
    element.deleteCar.disabled = element.listvoit.value === "none" || element.listvoit.value === "";
    element.editCar.disabled = element.listvoit.value === "none" || element.listvoit.value === "";
  });

  //Annuler ou stop
  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      handlers.handleCrossIcon(e);
    });
  }

  //Fermer les box

  element.closeButton.addEventListener("click", (e) => {
    handlers.handleCloseButton(e);
  });

  element.closeAuthButton.addEventListener("click", (e) => {
    handlers.handleCloseButton(e);
  })

  element.closeSettingButton.addEventListener("click", (e) => {
    handlers.handleCloseButton(e);
  });


  if (element.inscrLink) {
    element.inscrLink.addEventListener("click", (e) => {
      UI.toggleInsc(true)
    })
  }

  if (element.connLink) {
    element.connLink.addEventListener("click", (e) => {
      UI.toggleInsc(false)
    })
  }
}
