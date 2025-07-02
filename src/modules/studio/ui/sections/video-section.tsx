"use client"

import { trpc } from "@/trpc/client"

export const VideoSection = () => {
    const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery({
        limit: 5,
    }, {
    getNextPageParam:(lastPage) => lastPage.nextCursor,
    })

    return (
        <div>
            Videos section
        </div>
    )
}
