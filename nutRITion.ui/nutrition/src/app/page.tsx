'use client'

import { useState } from 'react';

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
    <div>
      <h1>Meal Plan Generator</h1>
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Meal Plan'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mealPlan && (
        <div>
          <h2>Your Meal Plan:</h2>
          <p>{mealPlan}</p>
        </div>
      )}
    </div>
  );
  
}