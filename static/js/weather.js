// Function to fetch weather data from the API
async function fetchWeatherData(lat, lon) {
    try {
        showLoading();
        const response = await fetch(`/api/weather/${lat}/${lon}`);
        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }
        const data = await response.json();
        updateWeatherDisplay(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-description').textContent = 'Bummer! Can\'t grab the weather vibes right now 😢';
        hideLoading();
    }
}

// Function to get weather icon URL
function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Function to format time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dateStr;
    if (date.toDateString() === today.toDateString()) {
        dateStr = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        dateStr = 'Mañana';  // Surfer slang for tomorrow
    } else {
        dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
    
    const timeStr = date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    return `${dateStr}, ${timeStr}`;
}

// Function to convert weather description to surfer lingo
function getSurferDescription(description, temp, windSpeed) {
    const lowercaseDesc = description.toLowerCase();
    
    // Base conditions
    if (lowercaseDesc.includes('clear')) return 'Epic blue skies, brah! 🌞';
    if (lowercaseDesc.includes('cloud')) return 'Partly stoked skies 🌤';
    if (lowercaseDesc.includes('rain')) return 'Water falling from above too! 🌧';
    if (lowercaseDesc.includes('thunderstorm')) return 'Zeus is throwing a party! ⚡';
    if (lowercaseDesc.includes('snow')) return 'Powder day alert! ❄️';
    if (lowercaseDesc.includes('mist') || lowercaseDesc.includes('fog')) return 'Steamy vibes rolling in 🌫';
    
    // Default
    return 'Checking out the scene 🏄‍♂️';
}

// Function to get wind description
function getWindDescription(speed) {
    if (speed < 2) return 'Dead calm, brah 😴';
    if (speed < 5) return 'Light breeze, maybe grab a longboard 🏄‍♂️';
    if (speed < 8) return 'Getting good, time to ride! 🌊';
    if (speed < 12) return 'Totally radical conditions! 🏄‍♂️';
    return 'Epic winds, send it! 🌊🏄‍♂️';
}

// Function to update the weather display with new data
function updateWeatherDisplay(data) {
    // Update current conditions
    const current = data.current;
    
    // Update current weather icon
    const currentIcon = document.getElementById('current-weather-icon');
    currentIcon.src = getWeatherIconUrl(current.weather[0].icon);
    currentIcon.classList.remove('hidden');
    
    // Update current weather data
    document.getElementById('temperature').textContent = Math.round(current.temp);
    document.getElementById('wind-speed').textContent = current.wind_speed;
    document.getElementById('wind-direction').textContent = current.wind_deg;
    document.getElementById('humidity').textContent = current.humidity;
    document.getElementById('weather-description').textContent = 
        getSurferDescription(current.weather[0].description, current.temp, current.wind_speed);

    // Update hourly forecast
    const hourlyContainer = document.getElementById('hourly-forecast');
    hourlyContainer.innerHTML = ''; // Clear existing forecast

    // Display next 24 hours
    data.hourly.slice(0, 24).forEach((hour) => {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'forecast-item bg-white p-4 rounded-lg shadow text-center';
        hourDiv.innerHTML = `
            <p class="text-sm font-semibold text-gray-600 mb-2 min-h-[2.5rem]">${formatTime(hour.dt)}</p>
            <img src="${getWeatherIconUrl(hour.weather[0].icon)}" 
                 alt="${hour.weather[0].description}"
                 class="w-12 h-12 mx-auto mb-2">
            <p class="text-xl font-bold text-blue-600 mb-1">${Math.round(hour.temp)}°C</p>
            <div class="space-y-1">
                <p class="text-sm text-gray-600">${getWindDescription(hour.wind_speed)}</p>
                <p class="text-sm text-gray-500">${getSurferDescription(hour.weather[0].description, hour.temp, hour.wind_speed)}</p>
            </div>
        `;
        hourlyContainer.appendChild(hourDiv);
    });
}

// Add loading indicators
function showLoading() {
    document.getElementById('current-weather').classList.add('opacity-50');
}

function hideLoading() {
    document.getElementById('current-weather').classList.remove('opacity-50');
}
