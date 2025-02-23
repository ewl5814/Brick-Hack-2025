'use client'
import Nav from ".././navbar";
import { useState } from 'react';
import LocationsSelect from "./location-select";
import MealsSelect from "./meal-select";
import AllergensSelect from "./allergen-select";

interface MealPlanResponse {
  meal_plan: string;
}

export default function MealPlanPage() {
  const [mealPlan, setMealPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const generateMealPlan = async (userPrompt: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data: MealPlanResponse = await response.json();
      setMealPlan(data.meal_plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (selectedLocations.length === 0 || selectedMeals.length === 0 || selectedAllergens.length === 0) {
      setIsFormValid(false);
      setValidationError('Please make selections in all dropdowns before generating a meal plan.');
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
        setValidationError('Please make selections in all dropdowns before generating a meal plan.');
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
  
    const userPrompt = `Create a healthy meal plan for a student with the following preferences:
      Locations: ${selectedLocations.join(', ')}
      Meals: ${selectedMeals.join(', ')}
      Allergens to avoid: ${selectedAllergens.join(', ')}`;
    generateMealPlan(userPrompt);
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
        <div style={{ marginTop: '20px' }}>
          <h2>Your Meal Plan:</h2>
          <pre>{JSON.stringify(mealPlan, null, 2)}</pre>
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
      `}</style>
    </div>
  );
}