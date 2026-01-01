import { UI } from "./ui/UI.js";
import { phpFetch } from "./api/phpInteraction.js";
import { Utils } from "./utils.js";

export function createHandlers(builder, navigation, user) {



  // Navigation vers une destination avec confirmation
  

  //export
  return {
    handleAutoSearchClick,
    handleSearchBoxSubmit,
    handleCloseButton,
    handleListButton,
  };
}
