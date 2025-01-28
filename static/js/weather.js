// Weather descriptions
function getWindDescription(speed) {
    if (speed < 5) return 'Totally flat';
    if (speed < 10) return 'Perfect for beginners';
    if (speed < 20) return 'Epic conditions';
    if (speed < 30) return 'Radical! Expert only!';
    return 'Too gnarly!';
}

function getSurferDescription(description) {
    if (description.includes('clear')) return 'Epic blue skies, brah! ☀️';
    if (description.includes('cloud')) return 'Some clouds in the mix 🌥';
    if (description.includes('rain')) return 'Wet session ahead! 🌧';
    return 'Checking out the scene, brah! 🏄‍♂️';
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// Function to update weather display
async function updateWeather(lat, lon) {
    try {
        const response = await fetch(`/api/weather/${lat}/${lon}`);
        if (!response.ok) throw new Error('Weather data fetch failed');
        
        const data = await response.json();
        
        // Update current weather
        document.getElementById('temperature').textContent = Math.round(data.current.temp);
        document.getElementById('wind-speed').textContent = Math.round(data.current.wind_speed);
        document.getElementById('wind-direction').textContent = data.current.wind_deg;
        document.getElementById('humidity').textContent = data.current.humidity;
        document.getElementById('weather-description').textContent = getSurferDescription(data.current.weather[0].description);
        
        // Update weather icon
        const iconElement = document.getElementById('current-weather-icon');
        iconElement.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
        iconElement.classList.remove('hidden');
        
        // Update hourly forecast
        const hourlyForecast = document.getElementById('hourly-forecast');
        hourlyForecast.innerHTML = ''; // Clear existing forecast
        
        data.hourly.slice(0, 24).forEach(hour => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item bg-white p-4 rounded-lg shadow text-center';
            forecastItem.innerHTML = `
                <p class="text-sm text-gray-600">${formatTime(hour.dt)}</p>
                <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" 
                     alt="${hour.weather[0].description}"
                     class="w-10 h-10 mx-auto">
                <p class="text-lg font-semibold">${Math.round(hour.temp)}°C</p>
            `;
            hourlyForecast.appendChild(forecastItem);
        });
    } catch (error) {
        console.error('Error updating weather:', error);
    }
}

// Export functions for testing
export { updateWeather, formatTime, getWindDescription, getSurferDescription };
