'use client'
import Nav from "./navbar";
import CreateMealView from "./create-meal"
import Image from "next/image";
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
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div className="flex flex-col items-center">
            <Nav />
            <Image
                src="/home.png"
                alt="Some buritos"
                sizes="(max-width: 1920) 100vw, 33vw"
                width={1920}
                height={300}
            />
            <CreateMealView />
        </div>
      <h1>Meal Plan Generator</h1>
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Generate Meal Plan
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mealPlan && (
        <div style={{ marginTop: '20px' }}>
          <h2>Your Meal Plan:</h2>
          <p>{mealPlan}</p>
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

      {/* Add CSS for the spinner */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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
