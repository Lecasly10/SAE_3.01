import * as element from "./htmlElement.js";
import { handleAutoSearchClick, handleParkingList } from "./eventHandler.js";

import { removeRoute } from "./route.js";
import { emptySearchBox, setupUI, setResultTitle, toggleLoader } from "./UI.js";
import { phpFetch } from "./phpInteraction.js";

export async function initEvent(map, marker) {
  map.addListener("center_changed", () => {
    if (globalThis.routes.length !== 0) {
      globalThis.setTimeout(() => {
        map.panTo(marker.position);
      }, 3000);
    }
  });

  element.goCenterButton.addEventListener("click", () => {
    map.panTo(marker.position);
  });

  element.autoSearchButton.addEventListener("click", (e) => {
    handleAutoSearchClick(e, map, marker);
  });

  element.searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = element.searchBox.value.trim();

      if (query.length === 0) {
        element.resultContainer.style.visibility = "hidden";
        return;
      }

      toggleLoader(true);

      let search = {
        search: query,
      };

      const result = await phpFetch("search.php", search);
      setResultTitle("Résultats");
      handleParkingList(result.parkings, map, marker);
    }
  });

  element.listButton.addEventListener("click", async (e) => {
    e.preventDefault();

    toggleLoader(true);
    emptySearchBox();

    const result = await phpFetch("search.php", {});

    setResultTitle("Tous les Parkings");
    handleParkingList(result.parkings, map, marker);
  });

  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      e.preventDefault();
      emptySearchBox();
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
