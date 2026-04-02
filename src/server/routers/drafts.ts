import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { drafts } from "~/db/schema";
import { saveDraftSchema } from "~/schemas/posts";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import crypto from "crypto";

/**
 * Drafts router - handles draft autosave functionality with shareable links
 */
export const draftsRouter = router({
  /**
   * Get a single draft by ID or all drafts for the current user
   */
  get: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid draft ID").optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.id) {
        const [draft] = await ctx.db
          .select()
          .from(drafts)
          .where(eq(drafts.id, input.id))
          .limit(1);

        if (!draft) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Draft not found",
          });
        }

        // Verify ownership
        if (draft.authorId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Draft not found",
          });
        }

        return draft;
      }

      // Return all drafts for current user
      const userDrafts = await ctx.db
        .select()
        .from(drafts)
        .where(eq(drafts.authorId, ctx.user.id))
        .orderBy(desc(drafts.updatedAt))
        .limit(10);

      return userDrafts;
    }),

  /**
   * Create or update a draft (upsert)
   */
  save: protectedProcedure
    .input(saveDraftSchema)
    .mutation(async ({ ctx, input }) => {
      const now = new Date();

      if (input.id) {
        // Update existing draft
        const [existingDraft] = await ctx.db
          .select()
          .from(drafts)
          .where(eq(drafts.id, input.id))
          .limit(1);

        if (!existingDraft) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Draft not found",
          });
        }

        // Verify ownership
        if (existingDraft.authorId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Draft not found",
          });
        }

        const [updated] = await ctx.db
          .update(drafts)
          .set({
            title: input.title,
            content: input.content,
            coverImage: input.coverImage,
            coverImageAlt: input.coverImageAlt,
            description: input.description,
            tags: input.tags,
            postId: input.postId,
            updatedAt: now,
          })
          .where(eq(drafts.id, input.id))
          .returning();

        return updated;
      }

      // Create new draft
      const [created] = await ctx.db
        .insert(drafts)
        .values({
          authorId: ctx.user.id,
          title: input.title,
          content: input.content,
          coverImage: input.coverImage,
          coverImageAlt: input.coverImageAlt,
          description: input.description,
          tags: input.tags,
          postId: input.postId,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return created;
    }),

  /**
   * Delete a draft
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid draft ID"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(drafts)
        .where(eq(drafts.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found",
        });
      }

      // Verify ownership
      if (deleted.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found",
        });
      }

      return { success: true };
    }),

  /**
   * Get a draft by share key (public access)
   */
  getShared: publicProcedure
    .input(
      z.object({
        shareKey: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [draft] = await ctx.db
        .select()
        .from(drafts)
        .where(eq(drafts.shareKey, input.shareKey))
        .limit(1);

      if (!draft) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found or share link is invalid",
        });
      }

      return draft;
    }),

  /**
   * Generate a unique share key for a draft
   */
  generateShareKey: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid draft ID"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify draft exists and belongs to user
      const [existingDraft] = await ctx.db
        .select()
        .from(drafts)
        .where(eq(drafts.id, input.id))
        .limit(1);

      if (!existingDraft) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found",
        });
      }

      if (existingDraft.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found",
        });
      }

      // Generate a unique 16-character alphanumeric share key
      const shareKey = crypto.randomBytes(8).toString("hex");

      const [updated] = await ctx.db
        .update(drafts)
        .set({
          shareKey,
          updatedAt: new Date(),
        })
        .where(eq(drafts.id, input.id))
        .returning();

      return { shareKey: updated.shareKey };
    }),
});