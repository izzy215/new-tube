import { trpc } from "@/trpc/server";


const Page = () => {
    void trpc.playlists.gteHistory.prefetchINfinite()
}

export default Page;