import fs from "fs";
import csv from "csv-parser";
import Telemetry from "../models/telemetry.model.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../../clean_inverter_dataset.csv");

const inverterData = {};
let rowPointer = {};

const INVERTER_COUNT = 12;



// -----------------------------
// Filter function for bad rows
// -----------------------------
function isValidRow(row) {

  const temp = Number(row.temp);
  const power = Number(row.power);
  const pvPower = Number(row.pv_power);
  const vAB = Number(row.v_ab);

  // Skip rows where important telemetry values are zero
  if (
    temp === 0 ||
    power === 0 ||
    pvPower === 0 ||
    vAB === 0
  ) {
    return false;
  }

  return true;
}



// -----------------------------
// Load CSV
// -----------------------------
async function loadCSV() {

  return new Promise((resolve) => {

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {

        if (!row.inverter_id) return;

        // Skip bad rows early
        if (!isValidRow(row)) return;

        const id = row.inverter_id;

        if (!inverterData[id]) {
          inverterData[id] = [];
          rowPointer[id] = 0;
        }

        inverterData[id].push(row);

      })
      .on("end", () => {

        console.log("CSV loaded");

        console.log(
          "Inverters detected:",
          Object.keys(inverterData).length
        );

        resolve();

      });

  });

}



// -----------------------------
// Simulation cycle
// -----------------------------
async function simulateTelemetry() {

  const batch = [];

  const inverterIds = Object.keys(inverterData).slice(0, INVERTER_COUNT);

  inverterIds.forEach((id) => {

    const pointer = rowPointer[id];

    const rows = inverterData[id];

    if (!rows || rows.length === 0) return;

    const row = rows[pointer];

    if (!row) {

      // restart pointer when dataset ends
      rowPointer[id] = 0;
      return;

    }

    const telemetry = {

      inverterId: id,

      temperature: Number(row.temp),

      voltageCA: Number(row.v_ca),
      voltageBC: Number(row.v_bc),
      voltageAB: Number(row.v_ab),

      pvPower: Number(row.pv_power),
      power: Number(row.power),

      energyToday: Number(row.kwh_today),
      energyTotal: Number(row.kwh_total),

      timestamp: new Date(row.timestamp)

    };

    batch.push(telemetry);

    rowPointer[id] += 1;

  });

  if (batch.length > 0) {

    await Telemetry.insertMany(batch);

    console.log(
      `Inserted ${batch.length} telemetry rows`
    );

  }

}



// -----------------------------
// Start simulator
// -----------------------------
async function startSimulator() {

  try {

    console.log("Telemetry simulator starting...");


    console.log("MongoDB connected");

    await loadCSV();

    console.log("Simulator running...");

    // Run every 30 seconds
    setInterval(simulateTelemetry, 30000);

  } catch (error) {

    console.error("Simulator error:", error);

  }

}



// startSimulator();