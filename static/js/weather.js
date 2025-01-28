// Function to fetch weather data from the backend
async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        
        if (response.ok) {
            updateCurrentWeather(data.current);
            updateHourlyForecast(data.hourly);
        } else {
            console.error('Error fetching weather data:', data.error);
        }
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
    }
}

// Update current weather display
function updateCurrentWeather(current) {
    if (!current) return;
    
    document.getElementById('temperature').textContent = current.temp ? Math.round(current.temp) : '--';
    document.getElementById('wind-speed').textContent = current.wind_speed || '--';
    document.getElementById('wind-direction').textContent = current.wind_deg || '--';
    document.getElementById('humidity').textContent = current.humidity || '--';
    document.getElementById('weather-description').textContent = 
        current.weather && current.weather[0] ? current.weather[0].description : '--';
}

// Update hourly forecast display
function updateHourlyForecast(hourlyData) {
    const hourlyContainer = document.getElementById('hourly-weather');
    hourlyContainer.innerHTML = '';

    // Display next 24 hours
    hourlyData.slice(0, 24).forEach((hour, index) => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.innerHTML = `
            <div>Sesh Time: ${time}</div>
            <div>Temp Gauge: ${Math.round(hour.temp)}°C</div>
            <div>Wind Flow: ${hour.wind_speed} m/s, ${hour.wind_deg}°</div>
            <div>Beach Status: ${hour.weather[0].description}</div>
        `;
        
        hourlyContainer.appendChild(hourlyItem);
    });
}

// Fetch initial weather data for default location
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData(40.7128, -74.0060);  // Default to New York
});

// Export functions for testing
module.exports = {
    fetchWeatherData,
    updateCurrentWeather,
    updateHourlyForecast
};
