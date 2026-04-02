import { ilike, asc } from "drizzle-orm"
import { tags } from "~/db/schema"
import z from "zod"
import { publicProcedure, router } from "../trpc"

export const tagsRouter = router({
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          id: tags.id,
          name: tags.name,
          color: tags.color,
        })
        .from(tags)
        .where(ilike(tags.name, `%${input.query}%`))
        .limit(10)

      return results
    }),

  getPopular: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          id: tags.id,
          name: tags.name,
          color: tags.color,
        })
        .from(tags)
        .orderBy(asc(tags.name))
        .limit(input.limit)

      return results
    }),
})