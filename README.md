# 🏄‍♂️ Radical Windsurf Weather App

A gnarly Flask application that combines real-time weather data with an interactive windsurfer simulation. Built with surfer vibes and modern web technologies.

## ✨ Features

- **Weather Dashboard**
  - Real-time weather conditions with surfer-friendly language
  - Interactive map for location selection
  - 24-hour forecast with weather icons
  - Wind speed and direction indicators

- **Surfer Simulation**
  - Interactive boid simulation with windsurfer-themed elements
  - Dynamic flocking behavior
  - Cursor-avoiding surfers
  - Random surfer phrases with speech bubbles
  - Toggle between weather view and surfer simulation

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone [your-repo-url]
   cd windsurf-weather-app
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   npm install  # Install JavaScript dependencies
   ```

2. **Configure API Key**
   ```bash
   # Create .env file and add your OpenWeather API key
   echo "OPENWEATHER_API_KEY=your_api_key_here" > .env
   ```

3. **Run the App**
   ```bash
   python app.py
   ```

4. Open `http://localhost:5000` in your browser

## 🧪 Testing

The application includes a comprehensive test suite using Jest for JavaScript testing.

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch
```

### Test Coverage

- **Weather Module Tests**
  - API integration and data fetching
  - DOM updates and weather display
  - Time formatting and data conversion
  - Wind speed descriptions
  - Weather condition descriptions in surfer lingo
  - Error handling

### Test Structure

```
static/js/
├── __tests__/
│   └── weather.test.js    # Weather module tests
├── weather.js             # Weather functionality
└── ...
```

### Testing Stack

- **Jest**: Testing framework
- **JSDOM**: DOM environment simulation
- **Babel**: JavaScript transpilation
- **Mock Functions**: API and DOM manipulation testing

## 🛠 Tech Stack

- **Backend**: Flask 3.0.0
- **APIs**: OpenWeather API
- **Frontend**: 
  - Tailwind CSS for styling
  - Leaflet.js for maps
  - Canvas API for boid simulation
- **Testing**:
  - Jest 29.x
  - JSDOM for DOM testing
- **Dependencies**: See `requirements.txt` and `package.json`

## 🌊 Usage

1. Toggle between Weather View and Surfer Vibes using the switch
2. Click anywhere on the map to get weather data
3. Watch the surfers react to your cursor movement
4. Enjoy the rad weather forecasts with surfer slang!

## 📝 License

MIT License - Hang loose! 🤙

## 🤝 Contributing

Feel free to contribute to this radical project! Open an issue or submit a PR, brah!

### Development Guidelines

1. Write tests for new features
2. Ensure all tests pass before submitting PRs
3. Follow the existing code style
4. Keep the surfer vibes flowing! 🏄‍♂️
