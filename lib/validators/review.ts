import { z } from "zod";

export const SupportedLanguages = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Java",
  "C#",
  "Other"
] as const;

export const ReviewRequestSchema = z.object({
  code: z.string().min(1).max(8000),
  language: z.enum(SupportedLanguages)
});

export type ReviewRequestInput = z.infer<typeof ReviewRequestSchema>;
