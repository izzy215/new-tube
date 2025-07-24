import { z } from "zod";
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useUser, useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod"

import { trpc } from "@/trpc/client"
import { Button } from "@/components/ui/button";
import { commentInsertSchema } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface CommentFormProps {
    videoId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    variant?: "comment" | "reply";
};


export const CommentForm = ({
    videoId,
    parentId,
    onCancel,
    onSuccess,
    variant = "comment",
}: CommentFormProps) => { 
    const clerk = useClerk();
    const { user }  = useUser();

    const utils = trpc.useUtils();
    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            //쿼리 캐시 데이터 무효화후 새로고침 1. 모든 댓글, 2. 대댓글
            utils.comments.getMany.invalidate({ videoId });
            utils.comments.getMany.invalidate({ videoId, parentId });

            form.reset();
            toast.success("Comment added");
            onSuccess?.();
        }, 
        onError: (error) => {
            toast.error("something went wrong")

           if(error.data?.code === "UNAUTHORIZED") {
            clerk.openSignIn();
           }
        }
    });

    //강의하고 다른 typescript 버전? 으로 인한 추가코드 발생
    const schemaWithoutUserId = commentInsertSchema.omit({ userId: true });

    const form = useForm<z.infer<typeof schemaWithoutUserId>>({
        resolver: zodResolver(schemaWithoutUserId),
        defaultValues: {
            parentId: parentId,
            videoId,
            value: "",
        },
    })

    const handleSubmit = (values: z.infer<typeof schemaWithoutUserId>) => {
        create.mutate(values);
    }

    const handleCancel = () => {
        form.reset();
        onCancel?.();
    }
    
    return(
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex gap-4 group"
            >
                <UserAvatar 
                    size="lg"
                    imageUrl={user?.imageUrl || "/user-placeholder.svg"} 
                    name={user?.username || "User"} 
                />
                <div className="flex-1">
                    <FormField 
                      name="value"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea 
                                    {...field}
                                    placeholder={
                                        variant === "reply"
                                        ? "Reply to this comment.."
                                        : "Add a comment.."
                                    }
                                    className="resize-none bg-transparent overflow-hidden mini-h-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}/>
                    <div className="justify-end gap-2 mt-2 flex">
                        {onCancel && (
                            <Button variant="ghost" type="button" onClick={handleCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            disabled={create.isPending}
                            type="submit"
                            size="sm"
                        >
                        {variant === "reply" ? "Reply" : "Commnet"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
 }