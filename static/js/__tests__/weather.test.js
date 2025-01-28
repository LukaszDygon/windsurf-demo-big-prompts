import { updateWeather, formatTime, getWindDescription, getSurferDescription } from '../weather.js';

describe('Weather Module', () => {
    let mockWeatherData;
    
    beforeEach(() => {
        // Reset fetch mock
        fetch.mockReset();
        
        // Reset DOM elements
        document.getElementById('temperature').textContent = '--';
        document.getElementById('wind-speed').textContent = '--';
        document.getElementById('wind-direction').textContent = '--';
        document.getElementById('humidity').textContent = '--';
        document.getElementById('weather-description').textContent = '--';
        document.getElementById('current-weather-icon').classList.add('hidden');
        document.getElementById('hourly-forecast').innerHTML = '';
        
        // Mock weather data
        mockWeatherData = {
            current: {
                temp: 25,
                wind_speed: 15,
                wind_deg: 180,
                humidity: 60,
                weather: [{
                    description: 'clear sky',
                    icon: '01d'
                }]
            },
            hourly: Array(24).fill({
                dt: 1643673600,
                temp: 20,
                weather: [{
                    description: 'scattered clouds',
                    icon: '03d'
                }]
            })
        };
    });

    describe('updateWeather', () => {
        it('should update DOM elements with current weather data', async () => {
            // Mock successful API response
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockWeatherData)
            });

            await updateWeather(40.7128, -74.0060);

            expect(document.getElementById('temperature').textContent).toBe('25');
            expect(document.getElementById('wind-speed').textContent).toBe('15');
            expect(document.getElementById('wind-direction').textContent).toBe('180');
            expect(document.getElementById('humidity').textContent).toBe('60');
            expect(document.getElementById('weather-description').textContent).toBe('Epic blue skies, brah! ☀️');
            expect(document.getElementById('current-weather-icon').classList.contains('hidden')).toBe(false);
        });

        it('should handle API errors gracefully', async () => {
            // Mock failed API response
            fetch.mockRejectedValueOnce(new Error('API Error'));

            await updateWeather(40.7128, -74.0060);

            expect(document.getElementById('temperature').textContent).toBe('--');
            expect(document.getElementById('wind-speed').textContent).toBe('--');
            expect(document.getElementById('weather-description').textContent).toBe('--');
        });
    });

    describe('formatTime', () => {
        it('should format timestamp correctly', () => {
            const timestamp = 1643673600; // 2022-02-01 00:00:00 UTC
            const formatted = formatTime(timestamp);
            expect(formatted).toMatch(/\d{1,2}:\d{2} [AP]M/);
        });
    });

    describe('getWindDescription', () => {
        it('should return "Totally flat" for low wind speeds', () => {
            expect(getWindDescription(2)).toBe('Totally flat');
        });

        it('should return "Perfect for beginners" for moderate wind speeds', () => {
            expect(getWindDescription(8)).toBe('Perfect for beginners');
        });

        it('should return "Epic conditions" for ideal wind speeds', () => {
            expect(getWindDescription(15)).toBe('Epic conditions');
        });

        it('should return "Radical! Expert only!" for high wind speeds', () => {
            expect(getWindDescription(25)).toBe('Radical! Expert only!');
        });

        it('should return "Too gnarly!" for extreme wind speeds', () => {
            expect(getWindDescription(35)).toBe('Too gnarly!');
        });
    });

    describe('getSurferDescription', () => {
        it('should return sunny description for clear sky', () => {
            expect(getSurferDescription('clear sky')).toBe('Epic blue skies, brah! ☀️');
        });

        it('should return cloudy description for cloudy conditions', () => {
            expect(getSurferDescription('scattered clouds')).toBe('Some clouds in the mix 🌥');
        });

        it('should return rainy description for rain', () => {
            expect(getSurferDescription('light rain')).toBe('Wet session ahead! 🌧');
        });

        it('should return default description for unknown weather', () => {
            expect(getSurferDescription('unknown')).toBe('Checking out the scene, brah! 🏄‍♂️');
        });
    });
});
