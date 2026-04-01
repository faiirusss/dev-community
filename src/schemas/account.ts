import { z } from "zod";
import { passwordSchema } from "~/schemas/auth";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  username: z.string().min(1, "Username is required for confirmation"),
});

export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
