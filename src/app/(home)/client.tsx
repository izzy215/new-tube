"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {


    //useSuspenseQuery 
    const [data] = trpc.hello.useSuspenseQuery({
       text: "Antonio"
    });

 return (
    <div>
        PageClient says: {data.greeting }
    </div>
 )   
}