import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").nullable(),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal('')),
  role: z.enum(["owner", "manager", "staff"]), // Removed .default()
  is_active: z.boolean(), // Removed .default()
});

export type StaffFormValues = z.infer<typeof staffSchema>;