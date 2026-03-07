import mongoose from "mongoose";

const inverterSchema = new mongoose.Schema(
  {
    inverterId: {
      type: Number,
      required: true,
      unique: true
    },

    name: {
      type: String
    },

    location: {
      type: String
    },

    capacityKWh: {
      type: Number
    },

    plant:{
      type: String,
      default: "Plant1"
    },

    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Inverter = mongoose.model("Inverter", inverterSchema);

export default Inverter;