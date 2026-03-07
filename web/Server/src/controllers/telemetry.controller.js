import Telemetry from "../models/telemetry.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllTelemetry = asyncHandler(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const totalRecords = await Telemetry.countDocuments();

  const data = await Telemetry
    .find()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages
    },
    data
  });

});

export const getTelemetryByInverter = asyncHandler(async (req, res) => {

  const { inverterId } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const totalRecords = await Telemetry.countDocuments({ inverterId });

  const data = await Telemetry
    .find({ inverterId })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    inverterId,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages
    },
    data
  });

});

// Latest telemetry for each inverter
export const getLatestTelemetry = asyncHandler(async (req, res) => {

  const data = await Telemetry.aggregate([
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: "$inverterId",
        latest: { $first: "$$ROOT" }
      }
    }
  ]);

  const result = data.map(item => item.latest);

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });

});


// // Add telemetry (optional manual API)
export const addTelemetry = asyncHandler(async (req, res) => {

  const telemetry = await Telemetry.create(req.body);

  res.status(201).json({
    success: true,
    data: telemetry
  });

});


// // Get all telemetry (latest first)
// export const getAllTelemetry = asyncHandler(async (req, res) => {

//   const limit = Number(req.query.limit) || 100;

//   const data = await Telemetry
//     .find()
//     .sort({ timestamp: -1 })
//     .limit(limit);

//   res.json({
//     success: true,
//     count: data.length,
//     data
//   });

// });


// // Filter telemetry by inverter
// export const getTelemetryByInverter = asyncHandler(async (req, res) => {

//   const { inverterId } = req.params;

//   const limit = Number(req.query.limit) || 100;

//   const data = await Telemetry
//     .find({ inverterId })
//     .sort({ timestamp: -1 })
//     .limit(limit);

//   res.json({
//     success: true,
//     inverterId,
//     count: data.length,
//     data
//   });

// });