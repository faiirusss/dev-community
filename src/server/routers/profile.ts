import { eq } from "drizzle-orm";
import z from "zod";
import { users } from "~/db/schema";
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
});
