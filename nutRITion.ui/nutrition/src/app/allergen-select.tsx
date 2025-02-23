import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllergens } from "./hardcode/allergens";

export default function AllergensSelect() {
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const allergens = getAllergens();

    // Handle selecting and unselecting allergens
    const handleSelectionChange = (value: string) => {
        setSelectedAllergens((prevSelected) => {
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
                // Don't bind selectedAllergens as a string for the value, since it is an array
                onValueChange={(value) => handleSelectionChange(value)}
            >
                <SelectTrigger className="w-auto min-w-[180px]">
                    <SelectValue placeholder="Allergens">
                        {selectedAllergens.length > 0
                            ? selectedAllergens.join(", ")
                            : "Allergens"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {allergens.map((name, index) => (
                        <SelectItem key={index} value={name}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedAllergens.includes(name)}
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