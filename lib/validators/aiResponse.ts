import { z } from "zod";

export const AiReviewResponseSchema = z.object({
  summary: z.string().min(1),
  bugs: z.array(z.string()),
  performance: z.array(z.string()),
  security: z.array(z.string()),
  improvements: z.array(z.string())
});

export type AiReviewResponse = z.infer<typeof AiReviewResponseSchema>;
