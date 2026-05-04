import Prediction from "../models/prediction.model.js";
import asyncHandler from "../utils/asyncHandler.js";


// GET ALL PREDICTIONS
export const getAllPredictions = asyncHandler(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const totalRecords = await Prediction.countDocuments();

  const data = await Prediction
    .find()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalRecords / limit);

  res.status(200).json({
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



// GET PREDICTIONS BY INVERTER
export const getPredictionsByInverter = asyncHandler(async (req, res) => {

  const { inverter_id } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const totalRecords = await Prediction.countDocuments({ inverter_id });

  const data = await Prediction
    .find({ inverter_id })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalRecords / limit);

  res.status(200).json({
    success: true,

    inverter_id,

    pagination: {
      page,
      limit,
      totalRecords,
      totalPages
    },

    data
  });

});

export const getLatestRiskByInverter = asyncHandler(async (req, res) => {

  const data = await Prediction.aggregate([

    { $sort: { timestamp: -1 } },

    {
      $group: {
        _id: "$inverter_id",
        latest: { $first: "$$ROOT" }
      }
    }

  ]);

  const result = data.map(item => ({
    inverterId: item.latest.inverter_id,
    riskScore: item.latest.risk_score,
    power: item.latest.power,
    pvPower: item.latest.pv_power,
    temp: item.latest.temp,
    freq: item.latest.freq,
    ambientTemp: item.latest.ambient_temp,
  }));

  res.json({
    success: true,
    data: result
  });

});