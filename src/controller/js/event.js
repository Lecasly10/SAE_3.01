import * as element from "./htmlElement.js";
import * as handler from "./eventHandler.js";

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
    handler.handleAutoSearchClick(e, map, marker);
  });

  element.searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      handler.handleSearchBoxSubmit(e, map, marker);
    }
  });

  element.listButton.addEventListener("click", async (e) => {
    handler.handleListButton(e, map, marker);
  });

  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      handler.handleCrossIcon(e, map, marker);
    });
  }

  if (element.closeButton) {
    element.closeButton.addEventListener("click", (e) => {
      handler.handleCloseButton(e);
    });
  }
}
