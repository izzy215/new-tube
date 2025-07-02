import { Avatar } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton"
import { SidebarHeader, SidebarMenuItem, SidebarMenuButton ,useSidebar } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user-avatar";

export const StudioSidebarHeader = () => {

    const { user } = useUser();
    const { state } = useSidebar();

    if(!user) return (
        <SidebarHeader className="flex imtems-center justify-center pb-4">
            <Skeleton className="size-[112px] reounded-full"/>
            <div className="flex flex-col items-center mt-2 gap-y-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[100px]" />

            </div>
        </SidebarHeader>
    );

    if(state ==='collapsed'){
        return (
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Your profile" asChild>
                    <Link href="/users/current">
                        <UserAvatar
                          imageUrl={user.imageUrl}
                          name={user.fullName ?? "User"}
                          size="xs"
                          />
                          <span className="text-sm">Your profile</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarHeader className="flex items-center justify-center pb-4">
            <Link href="/users/current">
                <UserAvatar
                  imageUrl={user.imageUrl}
                  name={user.fullName ?? "User"}
                  className="size-[112px] hover:opacity-80 transition-opacity" 
                  />
            </Link>
            <div className="flex flex-col items-center mt-2 gap-y-1">
                <p className="text-sm font-medium">
                  Your profile
                </p>
                <p className="text-xs text=foreground">
                    {user.fullName}
                </p>
            </div>
        </SidebarHeader>
    )
}