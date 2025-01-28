/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');
const { fetchWeatherData, updateCurrentWeather, updateHourlyForecast } = require('../weather');

// Mock fetch globally
global.fetch = jest.fn();

describe('Weather Module', () => {
    let mockWeatherData;
    
    beforeEach(() => {
        // Reset fetch mock
        fetch.mockReset();
        
        // Set up DOM elements
        document.body.innerHTML = `
            <div id="temperature">--</div>
            <div id="wind-speed">--</div>
            <div id="wind-direction">--</div>
            <div id="humidity">--</div>
            <div id="weather-description">--</div>
            <div id="hourly-weather"></div>
        `;
        
        // Mock weather data
        mockWeatherData = {
            current: {
                temp: 20,
                wind_speed: 15,
                wind_deg: 180,
                humidity: 65,
                weather: [{ description: 'Gnarly waves' }]
            },
            hourly: Array(24).fill().map((_, i) => ({
                dt: Date.now() / 1000 + i * 3600,
                temp: 20 + i,
                wind_speed: 15 + i,
                wind_deg: 180,
                weather: [{ description: 'Radical weather' }]
            }))
        };
    });

    describe('fetchWeatherData', () => {
        it('should fetch weather data successfully', async () => {
            // Mock successful API response
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockWeatherData)
            });

            // Call the function
            await fetchWeatherData(40.7128, -74.0060);

            // Verify fetch was called with correct URL
            expect(fetch).toHaveBeenCalledWith(
                expect.stringMatching(/\/weather\?lat=40\.7128&lon=-74\.006/)
            );
        });

        it('should handle API errors gracefully', async () => {
            // Mock console.error
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            
            // Mock failed API response
            fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'API Error' })
            });

            // Call the function
            await fetchWeatherData(40.7128, -74.0060);

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });

        it('should handle network errors gracefully', async () => {
            // Mock console.error
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            
            // Mock network error
            fetch.mockRejectedValueOnce(new Error('Network error'));

            // Call the function
            await fetchWeatherData(40.7128, -74.0060);

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });
    });

    describe('updateCurrentWeather', () => {
        it('should update current weather display correctly', () => {
            updateCurrentWeather(mockWeatherData.current);

            // Verify DOM updates
            expect(document.getElementById('temperature').textContent)
                .toBe(mockWeatherData.current.temp.toString());
            expect(document.getElementById('wind-speed').textContent)
                .toBe(mockWeatherData.current.wind_speed.toString());
            expect(document.getElementById('wind-direction').textContent)
                .toBe(mockWeatherData.current.wind_deg.toString());
            expect(document.getElementById('humidity').textContent)
                .toBe(mockWeatherData.current.humidity.toString());
            expect(document.getElementById('weather-description').textContent)
                .toBe(mockWeatherData.current.weather[0].description);
        });

        it('should handle missing weather data gracefully', () => {
            const incompleteData = {
                temp: 20,
                // Missing other fields
            };

            updateCurrentWeather(incompleteData);

            // Verify partial updates
            expect(document.getElementById('temperature').textContent)
                .toBe('20');
            expect(document.getElementById('wind-speed').textContent)
                .toBe('--');
        });
    });

    describe('updateHourlyForecast', () => {
        it('should create correct number of hourly forecast items', () => {
            updateHourlyForecast(mockWeatherData.hourly);

            const hourlyContainer = document.getElementById('hourly-weather');
            const hourlyItems = hourlyContainer.getElementsByClassName('hourly-item');
            
            // Should show 24 hours
            expect(hourlyItems.length).toBe(24);
        });

        it('should format time correctly in hourly items', () => {
            const testDate = new Date();
            mockWeatherData.hourly[0].dt = testDate.getTime() / 1000;

            updateHourlyForecast(mockWeatherData.hourly);

            const firstHourlyItem = document.querySelector('.hourly-item');
            const expectedTime = testDate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            expect(firstHourlyItem.textContent).toContain(expectedTime);
        });

        it('should handle empty hourly data', () => {
            updateHourlyForecast([]);

            const hourlyContainer = document.getElementById('hourly-weather');
            expect(hourlyContainer.children.length).toBe(0);
        });
    });
});
