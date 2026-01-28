import axiosInstance from "./axiosInstance";

export const fetchUserDetails = () => {
  return axiosInstance.get("/users/me");
};

export const fetchUserBlogs = (userId) => {
  return axiosInstance.get(`/blogs/author/${userId}`);
};
