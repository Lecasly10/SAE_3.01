import * as element from "./htmlElement.js";
import {
  handleAutoSearchClick,
  handleParkingClick,
  handleParkingList,
} from "./eventHandler.js";

import { removeRoute } from "./route.js";
import { setupUI } from "./UI.js";
import { phpFetch } from "./phpInteraction.js";

export async function initEvent(map, marker) {
  element.goCenterButton.addEventListener("click", () => {
    map.setCenter(marker.position);
  });

  element.autoSearchButton.addEventListener("click", (e) => {
    handleAutoSearchClick(e, map, marker);
  });

  document
    .querySelectorAll(".parking")
    .forEach((link) =>
      link.addEventListener("click", (e) =>
        handleParkingClick(e, link, map, marker)
      )
    );

  element.searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const query = element.searchBox.value.trim();

      if (query.length === 0) {
        element.resultContainer.style.visibility = "hidden";
        return;
      }

      element.loader.style.display = "block";
      e.preventDefault();

      let search = {
        search: query,
      };

      const result = await phpFetch("controller/php/search.php", search);
      handleParkingList(result["parkings"]);
    }
  });

  listButton.addEventListener("click", async (e) => {
    element.loader.style.display = "block";
    e.preventDefault();
    const result = await phpFetch("controller/php/search.php", {});
    handleParkingList(result["parkings"]);
  });

  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      e.preventDefault();
      removeRoute("destParking");
      setupUI();
    });
  }

  if (element.closeButton) {
    element.closeButton.addEventListener("click", (e) => {
      e.preventDefault();
      element.resultContainer.style.visibility = "hidden";
    });
  }
}
