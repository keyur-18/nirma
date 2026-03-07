import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
  {
    inverterId: {
      type: Number,
      required: true
    },

    temperature: {
      type: Number
    },

    voltageCA: {
      type: Number
    },

    voltageBC: {
      type: Number
    },

    voltageAB: {
      type: Number
    },

    pvPower: {
      type: Number
    },

    power: {
      type: Number
    },

    energyToday: {
      type: Number
    },

    energyTotal: {
      type: Number
    },

    timestamp: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

export default Telemetry;