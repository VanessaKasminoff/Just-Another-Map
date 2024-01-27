// map object
async function buildMap() {
    const map = L.map('map', {
        center: userCoords.coordinates,
        zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const userPin = L.icon({
        iconUrl: 'assets/images/map-pin-solid.svg',
        iconSize: [38, 38]
    });

    let marker = L.marker(userCoords.coordinates, {icon: userPin});
    marker.addTo(map).bindPopup('<p><b>Your Location</b></p>').openPopup();
}

// get coordinates via geolocation api
let userCoords = { coordinates: [] };

async function getUserCoords() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return [pos.coords.latitude, pos.coords.longitude];
}

// get foursquare businesses

// process foursquare array

// window load
window.onload = async () => {
    let coords = await getUserCoords();
    // let strCoords = `${coords[0]},${coords[1]}`;
    userCoords.coordinates = coords;
    buildMap();
// event handlers
    let locationSelector = document.getElementById('location-select');
    locationSelector.addEventListener('change', async (e) => {
        e.preventDefault();
        let userSelection = locationSelector.value;
        console.log(userSelection)
    });
};

// business submit button
