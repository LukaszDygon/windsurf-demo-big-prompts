from flask import Flask, render_template, jsonify
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get API key from environment variable
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/weather/<lat>/<lon>')
def get_weather(lat, lon):
    """Get current weather data for given coordinates"""
    base_url = "https://api.openweathermap.org/data/3.0/onecall"
    
    params = {
        'lat': lat,
        'lon': lon,
        'appid': OPENWEATHER_API_KEY,
        'units': 'metric',
        'exclude': 'minutely'
    }
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
