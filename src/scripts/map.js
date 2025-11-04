async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { ColorScheme } = await google.maps.importLibrary("core");

  const defaultPosition = { lat: 49.1193, lng: 6.1757 }; // Mairie de Metz

  const map = new Map(document.getElementById("map"), {
    center: defaultPosition,
    zoom: 15,
    mapId: "map",
    mapTypeId: "roadmap",
    disableDefaultUI: true,
    colorScheme: ColorScheme.LIGHT,
  });

  let marker = await addMarker(
    map,
    defaultPosition,
    "Votre position",
    AdvancedMarkerElement
  );

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      async (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        marker.setMap(null);
        marker = await addMarker(
          map,
          pos,
          "Votre position",
          AdvancedMarkerElement
        );

        map.setCenter(pos);
      },
      (error) => {
        console.log(error);
        alert("Impossible d'obtenir la position.");
      },
      {
        enableHighAccuracy: true, // plus précis
        maximumAge: 0,
        timeout: 5000,
      }
    );
  } else alert("La géolocalisation n'est pas supportée par votre navigateur.");
}

async function addMarker(map, pos, message, AdvancedMarkerElement) {
  const icon = document.createElement("img");
  icon.src = "https://cdn-icons-png.flaticon.com/512/8308/8308414.png"; // ton URL ici
  icon.style.width = "40px";
  icon.style.height = "40px";
  const marker = new AdvancedMarkerElement({
    map,
    title: message,
    position: pos,
    content: icon,
  });
  return marker;
}

initMap();
