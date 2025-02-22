from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Ollama API URL
OLLAMA_URL = "http://localhost:11434/api/generate"

@app.route('/generate-meal-plan', methods=['POST'])
def generate_meal_plan():
    data = request.json
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Prepare the payload for Ollama
    payload = {
        "model": "llama3.1:8b",
        "prompt": prompt,
        "stream": False 
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        ollama_response = response.json()
        # Return the generated meal plan
        return jsonify({"meal_plan": ollama_response["response"]})
    except requests.exceptions.RequestException as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)