from flask import Flask, render_template, jsonify, request
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

@app.route('/weather')
def get_weather():
    lat = request.args.get('lat', '40.7128')  # Default to New York
    lon = request.args.get('lon', '-74.0060')
    
    # OpenWeather API endpoint
    url = f'https://api.openweathermap.org/data/3.0/onecall'
    
    params = {
        'lat': lat,
        'lon': lon,
        'appid': OPENWEATHER_API_KEY,
        'units': 'metric',
        'exclude': 'minutely'
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
