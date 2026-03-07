import fs from "fs";
import csv from "csv-parser";
import Inverter from "../models/inverter.model.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../../clean_inverter_dataset.csv");

const inverterMap = {};

async function loadInvertersFromCSV() {

  return new Promise((resolve) => {

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {

        const id = row.inverter_id;

        if (!id) return;

        if (!inverterMap[id]) {

          inverterMap[id] = {
            inverterId: id,
            capacityKWh: Number(row.kwh_total)
          };

        }

      })
      .on("end", () => {

        console.log("CSV inverter scan completed");

        resolve();

      });

  });

}



async function insertInverters() {

  const inverters = Object.values(inverterMap);

  if (inverters.length === 0) {
    console.log("No inverters found");
    return;
  }

  try {

    await Inverter.insertMany(inverters, {
      ordered: false
    });

    console.log(`Inserted ${inverters.length} inverters`);

  } catch (error) {

    console.log("Some inverters already exist (expected)");

  }

}



async function startInverterSimulator() {

  try {

    console.log("Loading inverters...");

    await loadInvertersFromCSV();

    await insertInverters();

    console.log("Inverter simulation complete");

  } catch (error) {

    console.error(error);

  }

}

// startInverterSimulator();