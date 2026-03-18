import { protectedProcedure, router } from "../trpc";

/**
 * Users router - handles user management
 */
export const userRouter = router({

  /**
   * Get current user profile
   * Convex: getCurrentProfile
   */
  getCurrentProfile: protectedProcedure.query(async ({ ctx }) => {
    // ctx.user is guaranteed to exist because of protectedProcedure middleware
    return ctx.user;
  }),
});
