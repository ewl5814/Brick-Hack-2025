import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getMeals } from ".././hardcode/meals";

interface MealsSelectProps {
  selectedMeals: string[];
  onSelectionChange: (selectedMeals: string[]) => void;
}

export default function MealsSelect({ selectedMeals, onSelectionChange }: Readonly<MealsSelectProps>) {
    const meals = getMeals();

    // Handle selecting and unselecting meals
    const handleSelectionChange = (value: string) => {
        const updatedMeals = selectedMeals.includes(value)
            ? selectedMeals.filter((item) => item !== value) // Remove if already selected
            : [...selectedMeals, value]; // Add if not selected
        onSelectionChange(updatedMeals);
    };

    return (
        <div className="text-center">
            <Select
                onValueChange={(value) => handleSelectionChange(value)}
            >
                <SelectTrigger className="w-auto min-w-[180px]">
                    <SelectValue placeholder="Meals">
                        {selectedMeals.length > 0
                            ? selectedMeals.join(", ")
                            : "Meals"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {meals.map((name, index) => (
                        <SelectItem key={index} value={name}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedMeals.includes(name)}
                                    onChange={() => handleSelectionChange(name)}  // Toggle selection
                                />
                                <span className="ml-2">{name}</span>
                            </label>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}