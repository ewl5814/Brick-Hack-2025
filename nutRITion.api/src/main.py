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
    user_prompt = data.get('prompt')

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    system_prompt = """ SYSTEM PROMPT: You are a nutritionist helping a college student create a healthy meal plan from food available on campus. 
                        Create a 7-day meal plan for the college student. You should try to follow the user prompt closely."""
    full_prompt = f"{system_prompt}\n\n{user_prompt}"

    # Prepare the payload for Ollama
    payload = {
        "model": "llama3.1:8b",
        "prompt": full_prompt,
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