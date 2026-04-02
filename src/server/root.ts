import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { profileRouter } from "./routers/profile";
import { draftsRouter } from "./routers/drafts";
import { postsRouter } from "./routers/posts";
import { tagsRouter } from "./routers/tags";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  profile: profileRouter,
  drafts: draftsRouter,
  posts: postsRouter,
  tags: tagsRouter,
});

export type AppRouter = typeof appRouter;
