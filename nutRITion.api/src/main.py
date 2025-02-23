from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os
import json

import nutRITion

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), base_url="https://api.llama-api.com")

# File to store the last responses
RESPONSE_FILE = "last_responses.json"

def extract_json_from_response(response_text):
    """
    Extracts JSON content from the response text by finding the first '{' and last '}'.
    Returns the parsed JSON object if valid, otherwise returns None.
    """
    try:
        # Find the first '{' and last '}'
        start_index = response_text.find('{')
        end_index = response_text.rfind('}')

        if start_index == -1 or end_index == -1:
            return None  # No JSON found

        # Extract the JSON content
        json_str = response_text[start_index:end_index + 1]

        # Parse the JSON content
        json_obj = json.loads(json_str)
        return json_obj
    except json.JSONDecodeError:
        return None  # Invalid JSON

def write_response_to_file(new_response):
    """
    Writes the new response to a file, maintaining the last 2-3 responses.
    """
    responses = []

    # Load existing responses if the file exists
    if os.path.exists(RESPONSE_FILE):
        with open(RESPONSE_FILE, "r") as file:
            responses = json.load(file)

    # Add the new response to the list
    responses.append(new_response)

    # Keep only the last 2-3 responses
    if len(responses) > 3:
        responses = responses[-3:]  # Keep only the last 3 responses

    # Write the updated list back to the file
    with open(RESPONSE_FILE, "w") as file:
        json.dump(responses, file, indent=2)

@app.route('/generate-meal-plan', methods=['POST'])
def generate_meal_plan():
    # Get user prompt from request
    user_prompt = data.get('prompt')
    locations = data.get('locations')
    meal_times = data.get('mealTimes')
    allergens = data.get('allergens')

    data = nutRITion.query(locations, meal_times, allergens)

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Define system prompt
    system_prompt = """You are a nutritionist helping a college student create a healthy meal plan from food available on campus. 
                       Create ALL output in JSON format. Create a meal plan for the college student. Do not output the user prompt. 
                       Include relevant nutrition info such as location, calories, protein, fat, and carbs. Output this information as only numbers. 
                       Do not output anything besides JSON. RESPOND QUICKLY. 
                       Label the days as the days of the week. Output must include all days, all meals, names of meals, and stats of meals. 
                       ONLY USE THE FOLLOWING AVAILABLE FOODS:\n{data}"""

    max_retries = 3  # Maximum number of retries
    retry_count = 0

    while retry_count < max_retries:
        try:
            # Call OpenAI API
            print(user_prompt)
            response = client.chat.completions.create(
                model="llama3.1-8b",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},  # Ensure the response is in JSON format
            )

            # Extract the generated meal plan from the response
            meal_plan_response = response.choices[0].message.content

            # Attempt to parse the response as JSON
            meal_plan_json = extract_json_from_response(meal_plan_response)

            if meal_plan_json:
                # Write the response to a file
                # write_response_to_file(meal_plan_json)

                # Return the meal plan as JSON
                return jsonify({"meal_plan": meal_plan_json})
            else:
                # If JSON parsing fails, retry
                retry_count += 1
                print(f"Invalid JSON response. Retrying... ({retry_count}/{max_retries})")
        except Exception as e:
            # Handle errors
            return jsonify({"error": str(e)}), 500

    # If max retries reached, return an error
    return jsonify({"error": "Failed to generate a valid JSON response after multiple attempts"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5432)