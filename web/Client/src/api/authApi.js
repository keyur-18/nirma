import axiosClient from "./axiosClient";

export const registerUser = async (data) => {
  const res = await axiosClient.post("/users/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axiosClient.post("/users/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosClient.post("/users/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axiosClient.get("/users/me");
  return res.data;
};