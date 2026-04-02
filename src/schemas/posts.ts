import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters"),
  content: z.string().min(1, "Content is required"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens"
    ),
  coverImage: z.string().url().optional().or(z.literal("")),
  coverImageAlt: z.string().max(200).optional(),
  description: z.string().max(200).optional(),
  tags: z
    .array(z.string())
    .max(4, "Maximum 4 tags allowed")
    .optional(),
  published: z.boolean().default(false),
  scheduledAt: z.date().optional().nullable(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  id: z.string().uuid("Invalid post ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters")
    .optional(),
  content: z.string().min(1, "Content is required").optional(),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens"
    )
    .optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  coverImageAlt: z.string().max(200).optional(),
  description: z.string().max(200).optional(),
  tags: z
    .array(z.string())
    .max(4, "Maximum 4 tags allowed")
    .optional(),
  published: z.boolean().optional(),
  scheduledAt: z.date().optional().nullable(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

export type UpdatePostSchema = z.infer<typeof updatePostSchema>;

export const saveDraftSchema = z.object({
  id: z.string().uuid("Invalid draft ID").optional(),
  postId: z.string().uuid("Invalid post ID").optional(),
  title: z.string().max(150, "Title must be at most 150 characters").optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().max(200).optional(),
  description: z.string().max(200).optional(),
  tags: z.array(z.string()).max(4, "Maximum 4 tags allowed").optional(),
});

export type SaveDraftSchema = z.infer<typeof saveDraftSchema>;