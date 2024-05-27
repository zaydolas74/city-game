window.onload = function () {
  const kaart = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      'Kaartgegevens &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bijdragers',
  }).addTo(kaart);

  const locaties = [
    {
      coords: [51.5, -0.09],
      uitdaging: "Vind het dichtstbijzijnde monument en maak een foto.",
    },
  ];

  function getLocatie() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (positie) {
        const lat = positie.coords.latitude;
        const lon = positie.coords.longitude;
        kaart.setView([lat, lon], 13);
        toonPositie(positie);
        toonPositieFiguur(positie);
      });
    } else {
      alert("Geolocatie wordt niet ondersteund door deze browser.");
    }
  }

  function toonPositie(positie) {
    const lat = positie.coords.latitude;
    const lon = positie.coords.longitude;

    L.marker([lat, lon])
      .addTo(kaart)
      .bindPopup("<b>Je bent hier!</b>")
      .openPopup();

    locaties.forEach(function (locatie) {
      const afstand = berekenAfstand(
        lat,
        lon,
        locatie.coords[0],
        locatie.coords[1]
      );
      if (afstand < 0.1) {
        alert(locatie.uitdaging);
      }
    });
  }

  function toonPositieFiguur(positie) {
    const lat = positie.coords.latitude;
    const lon = positie.coords.longitude;

    const aantalCirkels = 5;

    for (let i = 0; i < aantalCirkels; i++) {
      let cirkelLat, cirkelLon;

      if (i === 0) {
        cirkelLat = lat + (Math.random() * 0.0004 - 0.0002);
        cirkelLon = lon + (Math.random() * 0.0004 - 0.0002);
      } else {
        cirkelLat = lat + (Math.random() * 0.09 - 0.045);
        cirkelLon = lon + (Math.random() * 0.09 - 0.045);
      }

      const cirkel = L.circle([cirkelLat, cirkelLon], {
        radius: 50,
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.2,
      }).addTo(kaart);

      cirkel.on("click", function () {
        const afstand = berekenAfstand(
          lat,
          lon,
          cirkel.getLatLng().lat,
          cirkel.getLatLng().lng
        );
        if (afstand <= cirkel.getRadius()) {
          L.marker([lat, lon])
            .addTo(kaart)
            .bindPopup("Maak een selfie")
            .openPopup();
        } else {
          L.marker([lat, lon])
            .addTo(kaart)
            .bindPopup("Je bent te ver van de opdracht!")
            .openPopup();
        }
      });
    }
  }

  function berekenAfstand(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000;
  }

  function toRad(deg) {
    return deg * (Math.PI / 180);
  }

  // Roep getLocatie aan wanneer de pagina geladen is
  window.onload = getLocatie;

  getLocatie();
};
