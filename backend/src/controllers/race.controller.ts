import { Hono } from "hono";
import { RaceService } from "../services/race.service";

const raceService = new RaceService();
export const RaceController = new Hono();

RaceController.get("/", async (c) => {
  const races = await raceService.findAll();
  return c.json(races);
});

RaceController.get("/:id", async (c) => {
  const id = c.req.param("id");
  const race = await raceService.findSpecific(id);
  return c.json(race);
});

RaceController.get("/season/:season", async (c) => {
  const season = c.req.param("season");
  const races = await raceService.findBySeason(season);
  return c.json(races);
});
