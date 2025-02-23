import { Button } from "@/components/ui/button"
import { HandPlatter, HomeIcon, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation";

export default function Nav() {
    const router = useRouter();
    return(
        <div className="w-full h-8 justify-center m-2 flex flex-row gap-2">
            <Button variant="ghost" onClick={() => router.push("/welcome")}>
                <HomeIcon />
                <p>Home</p>
            </Button>
            <Button variant="ghost">
                <UserIcon />
                <p>Profile</p>
            </Button>
            <Button variant="ghost">
                <HandPlatter />
                <p>Create Meal</p>
            </Button>
        </div>
    )
}
