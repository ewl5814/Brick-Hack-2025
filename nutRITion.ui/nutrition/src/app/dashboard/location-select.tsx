import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getLocations } from ".././hardcode/locations";

interface LocationsSelectProps {
  selectedLocations: string[];
  onSelectionChange: (selectedLocations: string[]) => void;
}

export default function LocationsSelect({ selectedLocations, onSelectionChange }: Readonly<LocationsSelectProps>) {
    const locations = getLocations();

    // Handle selecting and unselecting locations
    const handleSelectionChange = (value: string) => {
        const updatedLocations = selectedLocations.includes(value)
            ? selectedLocations.filter((item) => item !== value) // Remove if already selected
            : [...selectedLocations, value]; // Add if not selected
        onSelectionChange(updatedLocations);
    };

    return (
        <div className="text-center">
            <Select
                onValueChange={(value) => handleSelectionChange(value)}
            >
                <SelectTrigger className="w-auto min-w-[180px]">
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