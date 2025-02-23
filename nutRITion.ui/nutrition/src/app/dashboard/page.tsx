'use client'
import Nav from ".././navbar";
import { useState } from 'react';
import LocationsSelect from "./location-select";
import MealsSelect from "./meal-select";
import AllergensSelect from "./allergen-select";

interface MealDetails {
  calories: number;
  carbs: number;
  fat: number;
  location: string;
  name: string;
  protein: number;
}

interface Meals {
  [mealType: string]: MealDetails; // e.g., "Breakfast", "Lunch", "Dinner"
}

interface MealPlan {
  [day: string]: Meals; // e.g., "Monday", "Tuesday", etc.
}

interface MealPlanResponse {
  meal_plan: MealPlan; // meal_plan is already an object
}

export default function MealPlanPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>(''); // State for special notes
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const generateMealPlan = async (userPrompt: string, locations: string[], mealTimes: string[], allergens: string[]) => {
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:8000/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, locations: locations, mealTimes: mealTimes, allergens: allergens }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }
  
      const data: MealPlanResponse = await response.json();
  
      try {
        // Parse the meal_plan string into a MealPlan object
        const parsedMealPlan: MealPlan = data.meal_plan;
  
        // Set the parsed meal plan
        setMealPlan(parsedMealPlan);
      } catch (parseError) {
        throw new Error('Failed to parse meal plan: Invalid JSON');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  

  const validateForm = () => {
    if (
      selectedLocations.length === 0 ||
      selectedMeals.length === 0 ||
      selectedAllergens.length === 0 ||
      !specialNotes.trim() // Check if specialNotes is empty or just whitespace
    ) {
      setIsFormValid(false);
      setValidationError('Please fill out all fields before generating a meal plan.');
      return false;
    }
    setIsFormValid(true);
    setValidationError('');
    return true;
  };

  const handleGenerate = () => {
    if (!validateForm()) {
      // Reset the validation state to allow the shake animation to play again
      setIsFormValid(false);
      setValidationError('');

      // Set the error message again to trigger the shake animation
      setTimeout(() => {
        setValidationError('Please fill out all fields before generating a meal plan.');
      }, 10); // Small delay to ensure the state reset is processed

      // Start the fade-out animation after 3 seconds
      setTimeout(() => {
        setIsFadingOut(true); // Trigger the fade-out transition
      }, 2000);

      // Remove the error message after the fade-out transition completes
      setTimeout(() => {
        setValidationError('');
        setIsFadingOut(false); // Reset the fade-out state
      }, 2500); // 2000ms + 500ms for the transition duration

      return; // Stop if the form is not valid
    }

    const userPrompt = `Create a healthy meal plan for a vegetarian student with the following preferences:
      Locations: ${selectedLocations.join(', ')}
      Meals: ${selectedMeals.join(', ')}
      Allergens to avoid: ${selectedAllergens.join(', ')}
      Special Notes: ${specialNotes}`;

    generateMealPlan(userPrompt, selectedLocations, selectedMeals, selectedAllergens);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div className="flex flex-col items-center">
        <Nav />
        <div className="text-center flex flex-col items-center m-2 gap-2">
          <LocationsSelect
            selectedLocations={selectedLocations}
            onSelectionChange={setSelectedLocations}
          />
          <MealsSelect
            selectedMeals={selectedMeals}
            onSelectionChange={setSelectedMeals}
          />
          <AllergensSelect
            selectedAllergens={selectedAllergens}
            onSelectionChange={setSelectedAllergens}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="special-notes" className="font-semibold">
            Special Notes or Other Instructions:
          </label>
          <textarea
            id="special-notes"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            required
            className="w-full max-w-md p-2 border border-gray-300 rounded-md"
            placeholder="e.g., No nuts, prefer spicy food, etc."
          />
        </div>
        <h1>Meal Plan Generator</h1>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={validationError ? 'shake' : ''}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'rgb(247, 105, 2)',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Generate Meal Plan
        </button>
        <div style={{ minHeight: '30px' }}>
          {(validationError || isFadingOut) && (
            <p
              style={{
                color: 'red',
                marginTop: '10px',
                transition: 'opacity 0.5s',
                opacity: isFadingOut ? 0 : 1, // Fade out when isFadingOut is true
              }}
            >
              {validationError}
            </p>
          )}
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mealPlan && (
      <div className="meal-plan-grid">
        {Object.entries(mealPlan).map(([day, meals]) => (
          <div key={day} className="day-tile">
            <h3>{day}</h3>
            {Object.entries(meals).map(([mealType, mealDetails]) => (
              <div key={mealType} className="meal-details">
                <h4>{mealType}</h4>
                <p><strong>Name:</strong> {mealDetails.name}</p>
                <p><strong>Location:</strong> {mealDetails.location}</p>
                <p><strong>Calories:</strong> {mealDetails.calories}</p>
                <p><strong>Protein:</strong> {mealDetails.protein}g</p>
                <p><strong>Fat:</strong> {mealDetails.fat}g</p>
                <p><strong>Carbs:</strong> {mealDetails.carbs}g</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    )}

      {/* Full-screen loading overlay */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent gray overlay
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Ensure it's on top of everything
          }}
        >
          <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
        </div>
      )}

      {/* Add CSS for the spinner and shake animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid rgb(247, 105, 2);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        .meal-plan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .day-tile {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          background-color: #f9f9f9;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .day-tile h3 {
          margin-top: 0;
          font-size: 1.5rem;
          color: #333;
        }
        .meal-details {
          margin-top: 12px;
        }
        .meal-details h4 {
          margin: 0;
          font-size: 1.2rem;
          color: #555;
        }
        .meal-details p {
          margin: 4px 0;
          font-size: 1rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}