// 최상위 라우터 구성파일 
//도메인별 라우터 등록

import { categoriesRouter } from '@/modules/categories/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';

import { createTRPCRouter } from '../init';
import { videosRouter } from '@/modules/videos/server/procedure';

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  categories: categoriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;