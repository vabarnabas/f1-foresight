import { Hono } from "hono";
import { DriverService } from "../services/driver.service";

const driverService = new DriverService();
export const DriverController = new Hono();

DriverController.get("/", async (c) => {
  const drivers = await driverService.findAll();
  return c.json(drivers);
});

DriverController.get("/:name", async (c) => {
  const name = c.req.param("name");
  const driver = await driverService.findSpecific(name);
  return c.json(driver);
});
