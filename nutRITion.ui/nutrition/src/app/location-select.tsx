import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getLocations } from "./hardcode/locations";

export default function LocationsSelect() {
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const locations = getLocations();

    // Handle selecting and unselecting locations
    const handleSelectionChange = (value: string) => {
        setSelectedLocations((prevSelected) => {
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
                // Don't bind selectedLocations as a string for the value, since it is an array
                onValueChange={(value) => handleSelectionChange(value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Locations">
                        {selectedLocations.length > 0
                            ? selectedLocations.join(", ")
                            : "Locations"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {locations.map((name, index) => (
                        <SelectItem key={index} value={name}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedLocations.includes(name)}
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