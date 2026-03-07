import express from "express";
import {
  addTelemetry,
  getAllTelemetry,
  getTelemetryByInverter,
  getLatestTelemetry
} from "../controllers/telemetry.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getAllTelemetry);

router.get("/latest", protect, getLatestTelemetry);

router.get("/inverter/:inverterId", protect, getTelemetryByInverter);

router.post("/", protect, addTelemetry);

export default router;