import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(50).optional(),
  websiteUrl: z.string().max(200).optional().default(""),
  location: z.string().max(200).optional().default(""),
  bio: z.string().max(200).optional().default(""),

  // coding section
  currentlyLearning: z.string().max(200).optional().default(""),
  availableFor: z.string().max(200).optional().default(""),
  skills: z.string().max(200).optional().default(""),
  currentlyHacking: z.string().max(200).optional().default(""),

  // personal section
  pronouns: z.string().max(100).optional().default(""),

  // work section
  work: z.string().max(200).optional().default(""),
  education: z.string().max(200).optional().default(""),

  // branding section
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .optional()
    .default("#000000"),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
