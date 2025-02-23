import { Button } from "@/components/ui/button"
import { HandPlatter, HomeIcon, UserIcon } from "lucide-react"
export default function Nav() {
    return(
        <div className="w-full h-8 justify-center flex">
            <Button variant="ghost"><HomeIcon /><p>Home</p></Button>
            <Button variant="ghost"><UserIcon /><p>Profile</p></Button>
            <Button variant="ghost"><HandPlatter /><p>Create Meal</p></Button>
        </div>
    )
}
