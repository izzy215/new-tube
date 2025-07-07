import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const videosRouter = createTRPCRouter ({
    remove: protectedProcedure 
    .input(z.object({id: z.string().uuid()}))
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [removedVideo] = await db
        .delete(videos)
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId)
        ))
        .returning();

        if(!removedVideo) {
          throw new TRPCError ({ code: "NOT_FOUND"})
        }
        return removedVideo;
    }),
    update: protectedProcedure
      .input(videoUpdateSchema)
      .mutation(async ({ ctx, input}) => {
        const { id: userId } = ctx.user;

        if(!input.id) {
          throw new TRPCError({code : "BAD_REQUEST"})
        }

        const [updatedVideo] = await db
          .update(videos)
          .set({
            title: input.title,
            description: input.description,
            categoryId: input.categoryId,
            visibility: input.visibility,
            updatedAt: new Date(),
          })
          .where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId)
          ))
          .returning();

          if(!updatedVideo) {
            throw new TRPCError({ code : "NOT_FOUND"})
          }

          return updatedVideo;
      }),
    //.mutation(...) :: post/put 같은 데이터 변경작업
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id : userId } = ctx.user;

        //에러메시지 테스트
        // throw new TRPCError({code:"BAD_REQUEST", message: "에러메시지"})


        //mux upload
        const upload  = await mux.video.uploads.create({
          new_asset_settings:{
            passthrough: userId,
            playback_policy: ["public"],
            input: [
              {
                generated_subtitles: [
                  {
                    language_code: "en",
                    name:"English"
                  }
                ]
              }
            ]
          },
          cors_origin:"*" // TODO: In production, set to your url
        })


        //비디오 목록
        const [video] = await db
        .insert(videos)
        .values({
            userId,
            title:"Untitled",      
            muxStatus: "wating",
            muxUploadId: upload.id,
          })
          .returning();

          return {
            video: video,
            url: upload.url
          };
    })
})
