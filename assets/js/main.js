// map object
let map
async function buildMap() {
    map = L.map('map', {
        center: userCoords.coordinates,
        zoom: 14
    });
    console.log(map)

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
async function getFourSquare(userSelection, userCoords) {
    const searchParams = new URLSearchParams({
        categories: userSelection,
        ll: userCoords,
        open_now: 'true',
        sort: 'DISTANCE'
    });

    let response = await fetch(`https://api.foursquare.com/v3/places/search?${searchParams}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
        }
    });

    let data = await response.json();
    return data;
}

// process foursquare array and create markers
function createLocationMarkers(locations, map) {
    let businessMarkerArray = []

    locations.forEach((location) => {
        
        let businessPosition = [
            location.geocodes.main.latitude,
            location.geocodes.main.longitude
        ];
        let businessMarker = L.marker(businessPosition);
        businessMarker
        .addTo(map)
        .bindPopup(`${location.name} ${location.location.address}`)

        businessMarkerArray.push(businessMarker)
    });
    
    return businessMarkerArray
}

// initialize array of business markers for future deletion when loading a new set
let businessMarkerArray = []

// window load
window.onload = async () => {
    let coords = await getUserCoords();
    let strCoords = `${coords[0]},${coords[1]}`;
    userCoords.coordinates = coords;
    buildMap();
// event handlers
    let locationSelector = document.getElementById('location-select');
    locationSelector.addEventListener('change', async (event) => {
        businessMarkerArray.forEach(businessMarker => {
            businessMarker.remove()
        });

        event.preventDefault();
        let userSelection = locationSelector.value;
        let selectionResult = await getFourSquare(userSelection, strCoords);
        let locations = selectionResult.results;
        businessMarkerArray =  createLocationMarkers(locations, map)
    });
};
