import { signOut } from "@/lib/auth"
import { LogOut } from "lucide-react"

export async function SignOutButton() {
    return (
        <form action={async () => {
            "use server"
            await signOut()
        }}>
            <button type="submit" className="p-1.5 rounded-md text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-all">
                <LogOut className="w-3.5 h-3.5" />
            </button>
        </form>
    )
}