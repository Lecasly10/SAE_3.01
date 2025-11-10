import { getGoogleLibs } from "./googleAPI.js";
import { addMarker } from "./addMarkers.js";

const destinationIconURL =
  "https://cdn-icons-png.flaticon.com/512/4668/4668400.png";

export async function startRoute(map, origin, destination, id) {
  const { Route } = getGoogleLibs();

  const destinationMarker = await addMarker(
    map,
    destination,
    "Votre destination",
    destinationIconURL
  );

  const routeRequest = {
    origin,
    destination,
    travelMode: "DRIVING",
    routingPreference: "TRAFFIC_AWARE",
    fields: ["path"],
  };

  const { routes } = await Route.computeRoutes(routeRequest);

  if (!routes?.length) {
    alert("Aucun itinéraire trouvé.");
    return;
  }

  const polylines = routes[0].createPolylines();

  polylines.forEach((polyline) => polyline.setMap(map));

  globalThis.routes.push({
    id,
    destination,
    polylines,
    marker: destinationMarker,
  });
}

export function removeRoute(id) {
  const route = globalThis.routes.find((r) => r.id === id);
  if (!route) return;

  route.polylines.forEach((p) => p.setMap(null));
  route.marker?.setMap(null);

  globalThis.routes = globalThis.routes.filter((r) => r.id !== id);
}
