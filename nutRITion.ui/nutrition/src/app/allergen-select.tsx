import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getAllergens } from "./hardcode/allergens"

export default function AllergensSelect() {
    const allergens = getAllergens();

    return (
        <div className="text-center">
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Allergens" />
                </SelectTrigger>
                <SelectContent>
                    {
                        allergens.map((name, index) => {
                            return(
                                <SelectItem value={name} key={index}>{name}</SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
        </div>
    )
}
