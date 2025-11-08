import { getGoogleLibs } from "./googleAPI.js";
import { addMarker } from "./addMarkers.js";

const destinationIconURL =
  "https://cdn-icons-png.flaticon.com/512/4668/4668400.png";

export async function startRoute(map, origin, destination) {
  const { Route } = getGoogleLibs();

  const destinationMarker = await addMarker(
    map,
    destination,
    "Votre destination",
    destinationIconURL
  );

  const routeRequest = {
    origin: origin,
    destination: destination,
    travelMode: "DRIVING",
    routingPreference: "TRAFFIC_AWARE",
    fields: ["path"],
  };

  const { routes } = await Route.computeRoutes(routeRequest);

  if (!routes?.length) {
    alert("Aucun itinéraire trouvé.");
    return;
  }

  routes[0].createPolylines().forEach((polyline) => polyline.setMap(map));
}
