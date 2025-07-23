"use client"

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface VideosSectionProps {
    userId?: string;
}

export const VideosSection = (props: VideosSectionProps) => {
    return (
        <Suspense fallback={<VideoSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error</p>}> 
                <VideoSectionSuspense {...props}/>
            </ErrorBoundary>
        </Suspense>
    )
}

export const VideoSectionSkeleton = () => {
    return (
         <div className="gap-4 gay-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:gird-cols-3 2xl:grid-cols-4 ">
                {Array.from({ length: 18 }).map((_, index) => (
                        <VideoGridCardSkeleton key={index} />
                    ))
                }
            </div>
    )
}

export const VideoSectionSuspense = ({ userId }: VideosSectionProps) => {
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
        { userId, limit: DEFAULT_LIMIT },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    return (
        <div>
            <div className="gap-4 gay-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:gird-cols-3 2xl:grid-cols-4 ">
                {videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoGridCard key={video.id} data={video} />
                    ))
                }
            </div>
            <InfiniteScroll 
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}