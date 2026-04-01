import { eq, sql } from "drizzle-orm"
import { posts, comments, follows, users } from "~/db/schema"
import z from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = router({
  /**
   * get public profile by username
   */
  getByUsername: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [foundUser] = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          image: users.image,
          bio: users.bio,
          location: users.location,
          websiteUrl: users.websiteUrl,
          brandColor: users.brandColor,
          createdAt: users.createdAt,
          work: users.work,
          education: users.education,
          pronouns: users.pronouns,
          skills: users.skills,
          currentlyLearning: users.currentlyLearning,
          currentlyHacking: users.currentlyHacking,
          availableFor: users.availableFor,
        })
        .from(users)
        .where(eq(users.username, input.username))
        .limit(1);

      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User @${input.username} not found`,
        })
      }

      return foundUser;
    }),

  getStats: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [foundUser] = await ctx.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, input.username))
        .limit(1);

      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User @${input.username} not found`,
        });
      }

      const [postsCount] = await ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(posts)
        .where(eq(posts.authorId, foundUser.id));

      const [commentsCount] = await ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(comments)
        .where(eq(comments.authorId, foundUser.id));

      const [followsCount] = await ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(follows)
        .where(eq(follows.followerId, foundUser.id));

      return {
        postsPublished: postsCount?.count ?? 0,
        commentsWritten: commentsCount?.count ?? 0,
        tagsFollowed: followsCount?.count ?? 0,
      };
    }),
});

