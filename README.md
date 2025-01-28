# Windsurf Weather Application

A Flask-based weather application specifically designed for windsurfers, providing real-time weather data and forecasts using the OpenWeather API.

## Features

- Interactive map integration with Leaflet.js
- Current weather conditions display
- Hourly weather forecasts
- Wind speed and direction information
- Responsive design for all screen sizes

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the project root and add your OpenWeather API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```
5. Run the application:
   ```bash
   python app.py
   ```

## Usage

1. Open the application in your web browser
2. Click on any location on the map to view current weather conditions
3. View the hourly forecast for detailed weather information

## Dependencies

- Flask 3.0.0
- python-dotenv 1.0.0
- requests 2.31.0
- Leaflet.js (loaded via CDN)

## License

MIT License
