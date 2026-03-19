import { eq } from "drizzle-orm";
import { users } from "~/db/schema";
import { updateProfileSchema } from "~/schemas/profile";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

/**
 * Users router - handles user management
 */
export const userRouter = router({

  /**
   * Get current user profile 
   */
  getCurrentProfile: protectedProcedure.query(async ({ ctx }) => {
    const [userFound] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if(!userFound) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found"
      })
    }

    return userFound;
  }),

  /**
   * Update current user profile
   */
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({
          name: input.name,
          username: input.username,
          websiteUrl: input.websiteUrl || null,
          location: input.location || null,
          bio: input.bio || null,
          currentlyLearning: input.currentlyLearning || null,
          availableFor: input.availableFor || null,
          skills: input.skills || null,
          currentlyHacking: input.currentlyHacking || null,
          pronouns: input.pronouns || null,
          work: input.work || null,
          education: input.education || null,
          brandColor: input.brandColor || "#000000",
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        })
      }

      return updated;
    }),
});
