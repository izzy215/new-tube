// 최상위 라우터 구성파일 
//도메인별 라우터 등록

import { studioRouter } from '@/modules/studio/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedure';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { videoViewRouter } from '@/modules/video-views/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { suggestionsRouter } from '@/modules/suggestions/server/procedures';
import { videoReactionRouter } from '@/modules/video-reactions/server/procedures';
import { subscriptionsRouter } from '@/modules/subscription/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';


import { createTRPCRouter } from '../init';
import { searchRouters } from '@/modules/search/server/procedure';

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  categories: categoriesRouter,
  videoViews: videoViewRouter,
  videoReactions: videoReactionRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionsRouter,
  search: searchRouters,
});

// export type definition of API
export type AppRouter = typeof appRouter;