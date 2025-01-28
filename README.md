# Totally Rad Windsurf Weather Tracker 🏄‍♂️

Yo dude! Welcome to the most gnarly weather app for catching those sweet wind vibes! Built with Flask and some other rad tech, this app helps you track the perfect conditions for your next epic sesh.

## Sick Features 🌊

- Interactive map that's totally clickable
- Real-time beach vibes display
- Hourly forecast to plan your next shred
- Wind speed and direction for maximum stoke
- Killer modern interface that works everywhere
- OpenWeatherMap integration for the most tubular data

## Getting Started 🌴

1. Install the good stuff:
```bash
pip install -r requirements.txt
```

2. Drop your secret OpenWeatherMap key in a `.env` file (keep it secret, keep it safe):
```
OPENWEATHER_API_KEY=your_api_key_here
```

3. Fire it up:
```bash
python app.py
```

4. Hang ten to `http://localhost:5000` in your browser

## How to Shred 🏄‍♂️

- Click anywhere on the map to catch the weather vibes
- Peep the current conditions in the sidebar
- Scroll through the next 24 hours of radical forecasts

## Development History 🔄

This application was built using Cascade, an AI coding assistant, through a series of prompts. The original prompts used to create this application can be found in `demo_prompts.txt`. These prompts showcase:

- Initial application setup and structure
- Weather data integration
- Boid simulation implementation
- Testing setup and execution
- UI styling and improvements
- Error handling and data validation

The prompts demonstrate how complex features can be built iteratively using AI assistance while maintaining code quality and proper testing practices.

To understand how each feature was developed:
1. Review the prompts chronologically in `demo_prompts.txt`
2. Each prompt corresponds to specific commits in the repository
3. The prompts show the thought process and requirements that led to the current implementation

This documentation of the development process can be valuable for:
- Understanding the application's architecture
- Learning how to effectively use AI coding assistants
- Seeing how features evolved through iterations
- Following best practices in test-driven development

## Tech Stack 🤙

- Backend: Flask (Python's coolest web framework)
- Frontend: HTML, CSS, JavaScript (the holy trinity of web vibes)
- Map: Leaflet.js (for those sweet map moves)
- Weather Data: OpenWeatherMap API (keeping it real with the weather)
