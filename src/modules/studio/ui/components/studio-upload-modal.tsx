"use client";

import { ResponsiveModal } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button"
import { StudioUploader } from "@/modules/home/ui/components/studio-uploader";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const StudioUploadModal = () => {
    const router = useRouter();
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            toast.success(" 비디오 완성 ")
            utils.studio.getMany.invalidate();
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    const onSurccess = () => {
        if(!create.data?.video.id) return;

        create.reset()
        router.push(`/studio/vidios/${create.data.video.id}`);
    }


    return ( 
        <>
            <ResponsiveModal
                title="Upload a video"
                open={!!create.data}
                onOpenChange={() => {create.reset()}}
                >
                {create.data?.url 
                 ? <StudioUploader 
                    endpoint={create.data.url} 
                    onSuccess={onSurccess}
                    />
                 : <Loader2Icon /> 
                 }
            </ResponsiveModal>
            <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
                {create.isPending ? <Loader2Icon className="animate-spin" />  : <PlusIcon /> }
                Create
            </Button>
        </>
    )
}