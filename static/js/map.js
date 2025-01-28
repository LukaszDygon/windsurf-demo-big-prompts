// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a marker for the selected location
let marker = null;

// Handle map click events
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Update or create marker
    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }
    
    // Fetch weather data for clicked location
    fetchWeatherData(lat, lng);
});

// Enable map zooming and panning
map.on('zoom', function() {
    // Handle zoom events if needed
});

map.on('drag', function() {
    // Handle drag events if needed
});
