import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  timestamp: Date,
  inverter_id: Number,
  power: Number,
  temp: Number,
  pv_power: Number,
  freq: Number,
  ambient_temp: Number,
  risk_score: Number
});

const Prediction = mongoose.connection
  .useDb("solar_ml")
  .model("Prediction", predictionSchema, "predictions");

export default Prediction;