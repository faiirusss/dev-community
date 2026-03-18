import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { profileRouter } from "./routers/profile";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
