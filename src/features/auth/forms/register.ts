import z from "zod";
import { emailSchema, nameSchema, passwordSchema, usernameSchema } from "~/schemas/auth";

export const registerFormSchema = z.object({
 name: nameSchema,
 username: usernameSchema,
 email: emailSchema,
 password: passwordSchema,
 confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;