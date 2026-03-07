import axiosClient from "./axiosClient";

export const getAllInverters = async () => {
  const res = await axiosClient.get("/inverters");
  return res.data;
};