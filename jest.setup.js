// Mock fetch globally
global.fetch = jest.fn();

// Mock DOM elements that weather.js expects
document.body.innerHTML = `
    <div id="temperature">--</div>
    <div id="wind-speed">--</div>
    <div id="wind-direction">--</div>
    <div id="humidity">--</div>
    <div id="weather-description">--</div>
    <div id="current-weather-icon" class="hidden"></div>
    <div id="hourly-forecast"></div>
`;
