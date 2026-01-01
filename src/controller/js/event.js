import * as element from "./ui/htmlElement.js";
import { MapBuilder } from "./maps/builder.js";
import { Navigation } from "./navigation/navigation.js";
import { User } from "./user/user.js";
import { createHandlers } from "./eventHandler.js";
import { UI } from "./ui/UI.js";
import { initVehiculeEvent } from "./events/vehicule.events.js"
export async function initEvent() {
  const builder = MapBuilder.getInstance();
  const navigation = Navigation.getInstance();
  const user = User.getInstance();
  const handlers = createHandlers(builder, navigation, user);

  initVehiculeEvent(builder, navigation, user);

  document.addEventListener('offline', () => {
    console.warn("User offline !");
    alert("La connexion à été perdu !")
  });

  window.addEventListener('error', (event) => {
    console.error('Erreur :', event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error("Erreur :", event.reason);
  });


  //Recentrer
  element.goCenterButton.addEventListener("click", () => {
    UI.notify("MAP", "Map recentré !");
    builder.map.panTo(builder.userMarker.position);
  });

  //Settings
  element.settingsButton.addEventListener("click", (e) => {
    handlers.handleSettingButton(e);
    UI.toggleSetting(true);
  });

  //Rechercher le parking le plus proche
  element.autoSearchButton.addEventListener("click", (e) => {
    handlers.handleAutoSearchClick(e);
  });

  //Rechercher parkings
  element.searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Return") {
      handlers.handleSearchBoxSubmit(e);
    }
  });

  //Lister les parkings
  element.listButton.addEventListener("click", async (e) => {
    handlers.handleListButton(e);
  });

  //User
  element.logoutButton.addEventListener("click", async (e) => {
    await user.logout();
  })

  //Bouton valider USER 
  element.submitButton.addEventListener("click", async (e) => {
    handlers.handleSubmit(e);
  })

  //Bouton valider Param
  element.submitSett.addEventListener("click", async (e) => {
    handlers.handleUpdate(e)
  })

  //Gestion Voiture



  //Annuler ou stop

  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      handlers.handleStop();
    });
  }

  //Fermer les box

  element.closeButton.addEventListener("click", (e) => {
    handlers.handleCloseButton(e);
  });

  element.closeAuthButton.addEventListener("click", (e) => {
    UI.toggleAuth(false);
  })

  element.closeSettingButton.addEventListener("click", (e) => {
    UI.toggleSetting(false);
  });

  element.closeVoit.addEventListener("click", async (e) => {
    UI.toggleVoiture(false);
  })

  element.closeEdit.addEventListener("click", async (e) => {
    UI.toggleVoitureEdit(false);
  })

  //User Account Button

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
