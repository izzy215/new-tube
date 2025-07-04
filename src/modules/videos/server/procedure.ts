import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const videosRouter = createTRPCRouter ({
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
