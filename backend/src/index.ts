import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { RaceController } from "./controllers/race.controller";
import { DriverController } from "./controllers/driver.controller";
import { cors } from "hono/cors";
import { PredictionController } from "./controllers/prediction.controller";
import { logger } from "hono/logger";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use(cors());
app.use(logger());

app.route("/races", RaceController);
app.route("/drivers", DriverController);
app.route("/predictions", PredictionController);

const port = parseInt(process.env.PORT ?? "3000");
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
