import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getLocations } from "./http-handlers/location"

export default function LocationSelect() {
    const locations = getLocations();

    return (
        <div className="text-center">
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Locations" />
                </SelectTrigger>
                <SelectContent>
                    {
                        locations.map((name, index) => {
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
