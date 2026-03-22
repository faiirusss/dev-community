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
          createdAt: users.createdAt,
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

  /**
   * Get profile stats — posts, comments, tags followed
   *
   * Uses a single query with scalar subselects instead of 3 separate
   * round-trips, which is more efficient for PostgreSQL.
   */
  getStats: publicProcedure
    .input(z.object({ username: z.string().min(1).max(50) }))
    .query(async ({ ctx, input }) => {
      const [stats] = await ctx.db
        .select({
          postsPublished: sql<number>`
            (SELECT COUNT(*)::int
             FROM ${posts}
             WHERE ${posts.authorId} = ${users.id}
             AND   ${posts.published} = true)
          `.as("posts_published"),
 
          commentsWritten: sql<number>`
            (SELECT COUNT(*)::int
             FROM ${comments}
             WHERE ${comments.authorId} = ${users.id})
          `.as("comments_written"),
 
          tagsFollowed: sql<number>`
            (SELECT COUNT(*)::int
             FROM ${follows}
             WHERE ${follows.followerId} = ${users.id})
          `.as("tags_followed"),
        })
        .from(users)
        .where(eq(users.username, input.username))
        .limit(1)
 
      if (!stats) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User @${input.username} not found`,
        })
      }
 
      return {
        postsPublished: stats?.postsPublished ?? 0,
        commentsWritten: stats?.commentsWritten ?? 0,
        tagsFollowed: stats?.tagsFollowed ?? 0,
      }
    }),
});

