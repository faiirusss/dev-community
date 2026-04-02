import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export const postFormSchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().max(200).optional(),
  description: z.string().max(200).optional(),
  tags: z.array(z.string()).max(4),
  published: z.boolean(),
  scheduledAt: z.date().nullable().optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
})

export type PostFormSchema = z.infer<typeof postFormSchema>

export const defaultPostValues: PostFormSchema = {
  title: "",
  content: "",
  slug: "",
  coverImage: undefined,
  coverImageAlt: undefined,
  description: undefined,
  tags: [],
  published: false,
  scheduledAt: null,
  canonicalUrl: undefined,
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}