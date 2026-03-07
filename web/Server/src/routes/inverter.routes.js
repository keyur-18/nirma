import express from "express";
import {
  createInverter,
  getAllInverters,
  getInverterById,
  updateInverter,
  deleteInverter
} from "../controllers/inverter.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// create inverter
router.post("/", protect, createInverter);

// get all inverters
router.get("/", protect, getAllInverters);

// get single inverter
router.get("/:id", protect, getInverterById);

// update inverter
router.put("/:id", protect, updateInverter);

// delete inverter
router.delete("/:id", protect, deleteInverter);

export default router;