import { z } from "zod";

const userSessionSchema = z.object({
  id: z.string(),
  framework: z.enum(["React"]).optional(),
  language: z.enum(["TypeScript"]).optional(),
  stylingLibrary: z.enum(["Tailwind"]).optional(),
});

export type UserSession = z.infer<typeof userSessionSchema>;

export const userSessionRequiredSchema = userSessionSchema.required();
