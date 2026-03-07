import axiosClient from "./axiosClient";

export const getAllPredictions = async (page, limit) => {
  const res = await axiosClient.get(
    `/predictions?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getPredictionsByInverter = async (id, page, limit) => {
  const res = await axiosClient.get(
    `/predictions/inverter/${id}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getLatestRisk = async () => {

  const res = await axiosClient.get("/predictions/latest");

  return res.data;

};