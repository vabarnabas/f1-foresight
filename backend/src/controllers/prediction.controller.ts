import { Hono } from "hono";
import { PredictionService } from "../services/prediction.service";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createPredictionSchema } from "../dto/create-prediction.dto";
import { RaceService } from "../services/race.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { QuotaService } from "../services/quota.service";

const predictionService = new PredictionService();
const raceService = new RaceService();
const quotaService = new QuotaService();
export const PredictionController = new Hono();

PredictionController.use(clerkMiddleware());
PredictionController.use(authMiddleware);

PredictionController.get("/", async (c) => {
  const predictions = await predictionService.findAll();
  return c.json(predictions);
});

PredictionController.get("/me", async (c) => {
  const user = getAuth(c);

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

PredictionController.get("/race/:raceId/me", async (c) => {
  const { raceId } = c.req.param();

  const user = getAuth(c);

  if (!user?.userId) return c.json({ message: "Unauthorized" }, 401);

  const predictions = await predictionService.findByRaceAndUser(
    raceId,
    user.userId
  );
  return c.json(predictions);
});

PredictionController.get("/podium/race/:raceId/user/:userId", async (c) => {
  const { raceId, userId } = c.req.param();

  const prediction = await predictionService.findByRaceAndUser(raceId, userId);

  if (!prediction) {
    return c.json({ message: "Prediction Not Found" }, 404);
  }

  const race = await raceService.findSpecific(raceId);

  if (!race) {
    return c.json({ message: "Race Not Found" }, 404);
  }

  const podium = await predictionService.findPodium(prediction);
  return c.json({ podium, race });
});

PredictionController.get("/podium/race/:raceId/me", async (c) => {
  const { raceId } = c.req.param();

  const user = getAuth(c);

  if (!user?.userId) return c.json({ message: "Unauthorized" }, 401);

  const prediction = await predictionService.findByRaceAndUser(
    raceId,
    user.userId
  );

  if (!prediction) {
    return c.json({ message: "Prediction Not Found" }, 404);
  }

  const race = await raceService.findSpecific(raceId);

  if (!race) {
    return c.json({ message: "Race Not Found" }, 404);
  }

  const podium = await predictionService.findPodium(prediction);
  return c.json({ podium, race });
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

PredictionController.get("/analyze/:id", async (c) => {
  const id = c.req.param("id");
  const user = getAuth(c);

  if (!user?.userId) return c.json({ message: "Unauthorized" }, 401);

  const isInQuotaLimit = await quotaService.checkQuota(user.userId);

  if (isInQuotaLimit) {
    const prediction = await predictionService.findSpecific(id);

    if (!prediction) {
      return c.json({ message: "Prediction Not Found" }, 404);
    }

    const chat = await predictionService.analyze(prediction);
    await quotaService.createOrUpdate(user.userId);
    return c.json({
      ...JSON.parse(chat.choices[0].message.content!),
    });
  } else {
    return c.json({ message: "Quota Limit Reached" }, 403);
  }
});
