async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { Route } = await google.maps.importLibrary('routes');

  const defaultPosition = { lat: 49.1193, lng: 6.1757 }; // Mairie de Metz

  //Initialisation de la MAP
  let map = new Map(document.getElementById("map"), {
    center: defaultPosition,
    zoom: 20,
    mapId: "map",
    mapTypeId: "roadmap",
    disableDefaultUI: true,
  });

  // Marqueur de Base
  let marker = await addMarker(
    map,
    defaultPosition,
    "Votre position",
    AdvancedMarkerElement
  );

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

  const goCenterButton = createButton();

  goCenterButton.addEventListener("click", async () => {
    const origin = marker.position; 

      map.setOptions({
           center: origin,
      });

  });

}

// Fonction pour créer le bouton
function createButton() {
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
  icon.style.width = "60px";
  icon.style.height = "60px";

  return await new AdvancedMarkerElement({
    map,
    title: message,
    position: pos,
    content: icon,
  });
}

window.addEventListener('load', initMap);
