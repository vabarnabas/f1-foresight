import { Hono } from "hono";
import { PredictionService } from "../services/prediction.service";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createPredictionSchema } from "../dto/create-prediction.dto";

const predictionService = new PredictionService();
export const PredictionController = new Hono();

PredictionController.use(clerkMiddleware());

PredictionController.get("/", async (c) => {
  const predictions = await predictionService.findAll();
  return c.json(predictions);
});

PredictionController.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prediction = await predictionService.findSpecific(id);
  return c.json(prediction);
});

PredictionController.get("/race/:raceId", async (c) => {
  const raceId = c.req.param("raceId");
  const predictions = await predictionService.findByRace(raceId);
  return c.json(predictions);
});

PredictionController.get("/my", async (c) => {
  const user = getAuth(c);

  if (!user) return c.json({ message: "Unauthorized" }, 401);

  const predictions = await predictionService.findMy(user.userId!);
  return c.json(predictions);
});

PredictionController.post(
  "/",
  zValidator("json", createPredictionSchema),
  async (c) => {
    const dto = c.req.valid("json");

    const existingPrediction = await predictionService.findByRaceAndUser(
      dto.raceId,
      dto.userId
    );

    if (existingPrediction) {
      const prediction = await predictionService.update(
        existingPrediction.id,
        dto
      );
      return c.json(prediction);
    }

    const prediction = await predictionService.create(dto);
    return c.json(prediction);
  }
);
