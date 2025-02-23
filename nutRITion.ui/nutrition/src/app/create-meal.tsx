import AllergensSelect from "./allergen-select";
import LocationSelect from "./location-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function CreateMealView() {
    return(
        <div className="text-center flex flex-col items-center m-2">
            <h1 className="text-2xl font-bold">Generate a Meal</h1>
            <LocationSelect />
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Meal" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
            </Select>
            <AllergensSelect />
        </div>
    )
}
