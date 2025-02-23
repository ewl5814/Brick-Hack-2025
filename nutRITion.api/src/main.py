from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), base_url="https://api.llama-api.com")

@app.route('/generate-meal-plan', methods=['POST'])
def generate_meal_plan():
    # Get user prompt from request
    data = request.json
    user_prompt = data.get('prompt')

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Define system prompt
    system_prompt = """You are a nutritionist helping a college student create a healthy meal plan from food available on campus. 
                       Create ALL output in JSON format. Create a 7-day meal plan for the college student. Do not output the user prompt. 
                       Include relevant nutrition info such as calories, protein, fat, and carbs. Output this information as only numbers. 
                       Do not output anything besides JSON.
                       Label the days as the days of the week. Output must include all days, all meals, names of meals, and stats of meals."""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="llama3.1-8b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},  # Ensure the response is in JSON format
        )

        # Extract the generated meal plan from the response
        meal_plan = response.choices[0].message.content

        # Return the meal plan as JSON
        return jsonify({"meal_plan": meal_plan})
    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)