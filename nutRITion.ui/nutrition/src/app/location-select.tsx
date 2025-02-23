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
    console.log("Locations: " + locations)

    if(locations == null || locations.length < 1) {
        return (
            <div className="text-center">
                <Select disabled={true} >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Locations" />
                    </SelectTrigger>
                </Select>
            </div>
        )
    }

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
