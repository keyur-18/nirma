import axiosClient from "./axiosClient";

export const getAllTelemetry = async (page, limit) => {

  const res = await axiosClient.get(
    `/telemetry?page=${page}&limit=${limit}`
  );

  return res.data;

};

export const getTelemetryByInverter = async (id, page, limit) => {

  const res = await axiosClient.get(
    `/telemetry/inverter/${id}?page=${page}&limit=${limit}`
  );

  return res.data;

};