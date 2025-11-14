import { getGoogleLibs } from "./googleAPI.js";
import { addMarker } from "./addMarkers.js";

const destinationIconURL =
  "https://cdn-icons-png.flaticon.com/512/4668/4668400.png";

export async function startRoute(builder, origin, destination, id) {
  const { Route } = getGoogleLibs();

  const destinationMarker = await addMarker(
    builder,
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

  const route = routes[0];
  const polylines = route.createPolylines();

  polylines.forEach((polyline) => polyline.setMap(builder.map));

  const bounds = new google.maps.LatLngBounds();

  polylines.forEach((polyline) => {
    const path = polyline.getPath();
    path.forEach((latLng) => bounds.extend(latLng));
  });

  builder.map.fitBounds(bounds);

  builder.map.panTo(bounds.getCenter());

  builder.routes.push({
    id,
    destination,
    polylines,
    marker: destinationMarker,
  });
}

export function removeRoute(builder, id) {
  const route = builder.routes.find((r) => r.id === id);
  if (!route) return;

  route.polylines.forEach((p) => p.setMap(null));
  route.marker?.setMap(null);

  builder.routes = builder.routes.filter((r) => r.id !== id);
  builder.navigation = false;
}
