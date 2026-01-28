import axiosInstance from "./axiosInstance";

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const registerUser = (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const forgotPassword = (email) => {
  return axiosInstance.post("/auth/forgot-password", { email });
};

export const resetPassword = (data) => {
  return axiosInstance.post("/auth/reset-password", data);
};

export const fetchAllBlogs = () => {
  return axiosInstance.get("/blogs");
};