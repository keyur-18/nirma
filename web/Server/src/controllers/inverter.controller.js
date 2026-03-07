import Inverter from "../models/inverter.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createInverter = asyncHandler(async (req, res) => {
  const inverter = await Inverter.create(req.body);

  res.status(201).json({
    success: true,
    data: inverter
  });
});

// export const getAllInverters = asyncHandler(async (req, res) => {

//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;

//   const skip = (page - 1) * limit;

//   const totalRecords = await Inverter.countDocuments();

//   const inverters = await Inverter
//     .find()
//     .skip(skip)
//     .limit(limit)
//     .sort({ inverterId: 1 });

//   const totalPages = Math.ceil(totalRecords / limit);

//   res.status(200).json({
//     success: true,

//     pagination: {
//       page,
//       limit,
//       totalRecords,
//       totalPages
//     },

//     data: inverters
//   });

// });

export const getAllInverters = asyncHandler(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;

  const skip = (page - 1) * limit;

  const totalRecords = await Inverter.countDocuments();

  const inverters = await Inverter.aggregate([
    {
      $addFields: {
        inverterIdNum: { $toInt: "$inverterId" }
      }
    },
    { $sort: { inverterIdNum: 1 } },
    { $skip: skip },
    { $limit: limit }
  ]);

  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages
    },
    data: inverters
  });

});

export const getInverterById = asyncHandler(async (req, res) => {
  const inverter = await Inverter.findById(req.params.id);

  if (!inverter) {
    const error = new Error("Inverter not found");
    error.status = 404;
    throw error;
  }

  res.json({
    success: true,
    data: inverter
  });
});

export const updateInverter = asyncHandler(async (req, res) => {
  const inverter = await Inverter.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!inverter) {
    const error = new Error("Inverter not found");
    error.status = 404;
    throw error;
  }

  res.json({
    success: true,
    data: inverter
  });
});

export const deleteInverter = asyncHandler(async (req, res) => {
  const inverter = await Inverter.findByIdAndDelete(req.params.id);

  if (!inverter) {
    const error = new Error("Inverter not found");
    error.status = 404;
    throw error;
  }

  res.json({
    success: true,
    message: "Inverter deleted"
  });
});