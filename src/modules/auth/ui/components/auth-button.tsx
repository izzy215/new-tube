"use clients";

import { UserCircleIcon } from "lucide-react"
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "@/components/ui/button"

export const AuthButton = () => {
    //Todo: Add diffrent auth states
    return (
        <>
            <SignedIn>
                <UserButton />
                {/* Add menu items for Studio and User profile  */}
            </SignedIn>
            <SignedOut>
                {/* mode="modal" :: modal 로 동작 */}
                <SignInButton mode="modal">
                    <Button 
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 bordr-blue=500/20 rounded-full shadow-none ">
                        <UserCircleIcon />
                        Sign in
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    )
}