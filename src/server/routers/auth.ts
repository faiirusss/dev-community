import { z } from "zod";
import { eq } from "drizzle-orm";
import { users } from "~/db/schema";
import { router, protectedProcedure } from "../trpc";
import { auth } from "~/lib/auth";
import { TRPCError } from "@trpc/server";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

/**
 * Auth router - handles auth-related tRPC procedures
 * Note: login and register are handled by Better Auth directly via /api/auth
 */
export const authRouter = router({
  /**
   * Change the current user's password
   */
  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      if (!session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to change your password",
        });
      }

      try {
        await auth.api.changePassword({
          headers: ctx.req.headers,
          body: {
            currentPassword: input.currentPassword,
            newPassword: input.newPassword,
          },
        });

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error 
            ? error.message 
            : "Failed to change password. Please check your current password.",
        });
      }
    }),

  /**
   * Delete the current user's account.
   * Requires username confirmation to prevent accidental deletion.
   */
  deleteAccount: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      if (!session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to delete your account",
        });
      }

      if (ctx.user.username !== input.username) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Username does not match your account",
        });
      }

      const [deleted] = await ctx.db
        .delete(users)
        .where(eq(users.id, ctx.user.id))
        .returning({ id: users.id });

      if (!deleted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete account",
        });
      }

      return { success: true, message: "Account deleted successfully" };
    }),
});