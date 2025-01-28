// Initialize the map
const map = L.map('map').setView([40.7128, -74.0060], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add click handler to update weather data
let marker;
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    
    // Update or create marker
    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }
    
    // Fetch weather data for clicked location
    fetchWeatherData(lat, lng);
});
