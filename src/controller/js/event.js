import * as element from "./htmlElement.js";
import * as handler from "./eventHandler.js";

export async function initEvent(builder) {
  const userMarker = builder.userMarker;
  builder.map.addListener("center_changed", () => {
    if (builder.map.navigation) {
      globalThis.setTimeout(() => {
        builder.map.panTo(userMarker.position);
      }, 3000);
    }
  });

  element.goCenterButton.addEventListener("click", () => {
    builder.map.panTo(userMarker.position);
  });

  element.autoSearchButton.addEventListener("click", (e) => {
    handler.handleAutoSearchClick(e, builder, userMarker);
  });

  element.searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      handler.handleSearchBoxSubmit(e, builder, userMarker);
    }
  });

  element.listButton.addEventListener("click", async (e) => {
    handler.handleListButton(e, builder, userMarker);
  });

  if (element.crossIcon) {
    element.crossIcon.addEventListener("click", (e) => {
      handler.handleCrossIcon(e, builder, userMarker);
    });
  }

  if (element.closeButton) {
    element.closeButton.addEventListener("click", (e) => {
      handler.handleCloseButton(e, builder);
    });
  }
}
