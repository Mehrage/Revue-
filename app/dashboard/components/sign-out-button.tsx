'use server';

import { signOut } from "@/lib/auth"
import Button from "next/link"

export async function SignOutButton() {
    return (
        <form action={async () => {
            "use server"
            await signOut()
        }} className="ml-auto">
            <button type="submit" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Sign out</button>
        </form>
    )
}