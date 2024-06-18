import { Hono } from "hono";
import { PredictionService } from "../services/prediction.service";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createPredictionSchema } from "../dto/create-prediction.dto";
import { authMiddleware } from "../middleware/auth.middleware";

const predictionService = new PredictionService();
export const PredictionController = new Hono();

PredictionController.use(clerkMiddleware());

PredictionController.get("/", async (c) => {
  const predictions = await predictionService.findAll();
  return c.json(predictions);
});

PredictionController.get("/me", async (c) => {
  const user = getAuth(c);

  console.log("user", user);

  if (!user?.userId) return c.json({ message: "Unauthorized" }, 401);

  const predictions = await predictionService.findMy(user.userId!);
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

PredictionController.get("/podium/race/:raceId/user/:userId", async (c) => {
  const { raceId, userId } = c.req.param();

  console.log("asd", userId, raceId);

  const prediction = await predictionService.findByRaceAndUser(raceId, userId);

  if (!prediction) {
    return c.json({ message: "Prediction Not Found" }, 404);
  }

  const podium = await predictionService.findPodium(prediction);
  return c.json(podium);
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
