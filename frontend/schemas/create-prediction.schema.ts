import { z } from "zod";

export const createPredictionSchema = z.object({
  userId: z.string(),
  name: z.string(),
  raceId: z.string().uuid(),
  result: z.array(z.string().uuid()).length(3),
});

export type CreatePredictionDto = z.infer<typeof createPredictionSchema>;
