import { eq, desc, and } from "drizzle-orm";
import { posts } from "~/db/schema";
import { createPostSchema, updatePostSchema } from "~/schemas/posts";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

/**
 * Helper function to generate a slug from title
 */
function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Posts router - handles post CRUD operations
 */
export const postsRouter = router({
  // ============================================
  // PUBLIC PROCEDURES
  // ============================================

  /**
   * Get a single post by slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  /**
   * Get feed of published posts with pagination
   */
  getFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const feedPosts = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.publishedAt))
        .limit(input.limit)
        .offset(input.offset);

      return feedPosts;
    }),

  /**
   * Get published posts by author username
   */
  getByAuthor: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      // First get the user ID from username
      const { users } = await import("~/db/schema");
      const [author] = await ctx.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, input.username))
        .limit(1);

      if (!author) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User @${input.username} not found`,
        });
      }

      const authorPosts = await ctx.db
        .select()
        .from(posts)
        .where(and(eq(posts.authorId, author.id), eq(posts.published, true)))
        .orderBy(desc(posts.publishedAt));

      return authorPosts;
    }),

  // ============================================
  // PROTECTED PROCEDURES
  // ============================================

  /**
   * Create a new post
   */
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug || generateSlugFromTitle(input.title);

      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          slug,
          content: input.content,
          coverImage: input.coverImage || null,
          description: input.description || null,
          published: input.published,
          scheduledAt: input.scheduledAt || null,
          canonicalUrl: input.canonicalUrl || null,
          authorId: ctx.user.id,
          createdAt: new Date(),
        })
        .returning();

      if (!newPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post",
        });
      }

      return newPost;
    }),

  /**
   * Update an existing post
   */
  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this post",
        });
      }

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          ...(input.title !== undefined && { title: input.title }),
          ...(input.content !== undefined && { content: input.content }),
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.coverImage !== undefined && { coverImage: input.coverImage || null }),
          ...(input.coverImageAlt !== undefined && { coverImageAlt: input.coverImageAlt || null }),
          ...(input.description !== undefined && { description: input.description || null }),
          ...(input.tags !== undefined && { tags: input.tags }),
          ...(input.published !== undefined && { published: input.published }),
          ...(input.scheduledAt !== undefined && { scheduledAt: input.scheduledAt || null }),
          ...(input.canonicalUrl !== undefined && { canonicalUrl: input.canonicalUrl || null }),
          editedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning();

      if (!updatedPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update post",
        });
      }

      return updatedPost;
    }),

  /**
   * Publish a post
   */
  publish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to publish this post",
        });
      }

      const [publishedPost] = await ctx.db
        .update(posts)
        .set({
          published: true,
          publishedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning();

      if (!publishedPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to publish post",
        });
      }

      return publishedPost;
    }),

  /**
   * Unpublish a post
   */
  unpublish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to unpublish this post",
        });
      }

      const [unpublishedPost] = await ctx.db
        .update(posts)
        .set({
          published: false,
        })
        .where(eq(posts.id, input.id))
        .returning();

      if (!unpublishedPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unpublish post",
        });
      }

      return unpublishedPost;
    }),

  /**
   * Schedule a post for future publication
   */
  schedule: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        scheduledAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.scheduledAt <= new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scheduled date must be in the future",
        });
      }

      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to schedule this post",
        });
      }

      const [scheduledPost] = await ctx.db
        .update(posts)
        .set({
          scheduledAt: input.scheduledAt,
        })
        .where(eq(posts.id, input.id))
        .returning();

      if (!scheduledPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to schedule post",
        });
      }

      return scheduledPost;
    }),

  /**
   * Delete a post
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this post",
        });
      }

      const [deletedPost] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      if (!deletedPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete post",
        });
      }

      return deletedPost;
    }),

  /**
   * Get current user's posts
   */
  getMyPosts: protectedProcedure
    .input(
      z.object({
        includeDrafts: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const userPosts = await ctx.db
        .select()
        .from(posts)
        .where(
          input.includeDrafts
            ? eq(posts.authorId, ctx.user.id)
            : and(eq(posts.authorId, ctx.user.id), eq(posts.published, true))
        )
        .orderBy(desc(posts.createdAt));

      return userPosts;
    }),
});