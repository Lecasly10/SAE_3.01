async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { Route } = await google.maps.importLibrary('routes');

  const defaultPosition = { lat: 49.1193, lng: 6.1757 }; // Mairie de Metz

  const map = new Map(document.getElementById("map"), {
    center: defaultPosition,
    zoom: 15,
    mapId: "map",
    mapTypeId: "roadmap",
    disableDefaultUI: true,
    colorScheme: ColorScheme.LIGHT,
  });

  // Ajouter le marqueur initial
  let marker = await addMarker(
    map,
    defaultPosition,
    "Votre position",
    AdvancedMarkerElement
  );

  // Créer et ajouter le bouton
  const centerControlDiv = document.createElement("div");
  const navBar = document.getElementById("bottomnav")
  navBar.appendChild(centerControlDiv);
  const button = createPathButton();
  centerControlDiv.appendChild(button);
  //map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  // Géolocalisation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        marker.setMap(null);
        marker = await addMarker(map, pos, "Votre position", AdvancedMarkerElement);
        map.setCenter(pos);
      },
      async (error) => {
        console.log(error);
        marker.setMap(null);
        marker = await addMarker(map, defaultPosition, "Votre position", AdvancedMarkerElement);
        map.setCenter(defaultPosition)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  } else alert("La géolocalisation n'est pas supportée par votre navigateur.");

  const newpos = { lat : 49.119178, lng: 6.168469 };

  // Bouton pour afficher l'itinéraire
  button.addEventListener("click", async () => {
    const origin = marker.position; // AdvancedMarkerElement.position
    const destination = newpos;

    const request = {
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      routingPreference: 'TRAFFIC_AWARE',
      fields: ['path']
    };

    const {routes} = await Route.computeRoutes(request);

    if (!routes || routes.length === 0) {
      alert("Aucun itinéraire trouvé.");
      return;
    }

      const mapPolylines = routes[0].createPolylines();
      mapPolylines.forEach((polyline) => polyline.setMap(map));
      map.setCenter(origin);
  });
}

// Fonction pour créer le bouton
function createPathButton() {
  const controlButton = document.getElementById("button");
  controlButton.style.cursor = "pointer";
  controlButton.style.textAlign = "center";
  controlButton.title = "Itinéraire";
  controlButton.type = "button";
  return controlButton;
}

// Fonction pour ajouter un marqueur
async function addMarker(map, pos, message, AdvancedMarkerElement) {
  const icon = document.createElement("img");
  icon.src = "https://cdn-icons-png.flaticon.com/512/8308/8308414.png";
  icon.style.width = "40px";
  icon.style.height = "40px";

  return await new AdvancedMarkerElement({
    map,
    title: message,
    position: pos,
    content: icon,
  });
}

window.addEventListener('load', initMap);
