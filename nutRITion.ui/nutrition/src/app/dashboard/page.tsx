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

  const handleGenerate = () => {
    const userPrompt = "Create a healthy meal plan for a vegetarian student";
    generateMealPlan(userPrompt);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* ✅ Ensure Nav is at the top */}
      <div className="w-full">
        <Nav />
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="text-center flex flex-col items-center space-y-2">
          <LocationsSelect />
          <MealsSelect />
          <AllergensSelect />
        </div>

        <h1 className="text-xl font-bold mt-4">Meal Plan Generator</h1>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition mt-2"
        >
          Generate Meal Plan
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {mealPlan && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h2 className="font-bold">Your Meal Plan:</h2>
            <p>{mealPlan}</p>
          </div>
        )}
      </div>

      {/* ✅ Full-screen loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="spinner w-12 h-12"></div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}