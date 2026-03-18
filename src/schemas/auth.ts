import { z } from "zod";

export const nameSchema = z
  .string({ message: "Name is required"})
  .min(3, { message: "Name must be at least 3 characters" });

export const usernameSchema = z
  .string({ message: "Username is required"})
  .min(3, { message: "Username must be at least 3 characters" })

export const passwordSchema = z
  .string({ message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[a-z]/,{ message: "Password must be at least 1 huruf kecil"})
  .regex(/[A-Z]/, { message: "Password minimal 1 huruf besar"})
  .regex(/[0-9]/, { message: "Password minimal 1 angka"});
  
export const emailSchema = z
  .string({ message: "Email is required" })
  .email({ message: "Format email tidak tepat" });