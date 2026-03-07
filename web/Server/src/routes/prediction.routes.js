import express from "express";
import {
  getAllPredictions,
  getLatestRiskByInverter,
  getPredictionsByInverter
} from "../controllers/prediction.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/latest",getLatestRiskByInverter);
router.get("/", getAllPredictions);

router.get("/inverter/:inverter_id", getPredictionsByInverter);


export default router;