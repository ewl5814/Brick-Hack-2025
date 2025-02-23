import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllergens } from ".././hardcode/allergens";

interface AllergensSelectProps {
  selectedAllergens: string[];
  onSelectionChange: (selectedAllergens: string[]) => void;
}

export default function AllergensSelect({ selectedAllergens, onSelectionChange }: Readonly<AllergensSelectProps>) {
    const allergens = getAllergens();

    // Handle selecting and unselecting allergens
    const handleSelectionChange = (value: string) => {
        const updatedAllergens = selectedAllergens.includes(value)
            ? selectedAllergens.filter((item) => item !== value) // Remove if already selected
            : [...selectedAllergens, value]; // Add if not selected
        onSelectionChange(updatedAllergens);
    };

    return (
        <div className="text-center">
            <Select
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