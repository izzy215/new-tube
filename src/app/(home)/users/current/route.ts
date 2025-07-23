import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";


//clerkId 가 current 일때 DB ID 로 redirect  //GET 대문자!
export const GET = async () => {
    const { userId } = await auth();

    if(!userId) {
        return redirect("/sign-in");
    }

    const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId));
        if (!existingUser) {
            return redirect("/sign-in");
        }
        
    return redirect(`/users/${existingUser.id}`);
}