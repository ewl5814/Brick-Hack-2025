import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getMeals } from "./hardcode/meals";

export default function MealsSelect() {
    const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
    const meals = getMeals();

    // Handle selecting and unselecting meals
    const handleSelectionChange = (value: string) => {
        setSelectedMeals((prevSelected) => {
            if (prevSelected.includes(value)) {
                // If the location is already selected, remove it from the array
                return prevSelected.filter((item) => item !== value);
            } else {
                // Otherwise, add it to the array
                return [...prevSelected, value];
            }
        });
    };

    return (
        <div className="text-center">
            <Select
                // Don't bind selectedMeals as a string for the value, since it is an array
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