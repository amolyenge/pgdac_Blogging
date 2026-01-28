import axiosInstance from "./axiosInstance";

export const fetchAllBlogs = () => {
  return axiosInstance.get("/blogs");
};

export const fetchTrendingBlogs = () => {
  return axiosInstance.get("/blogs/trending");
};

export const fetchCategoryBlogs = (category) => {
  return axiosInstance.get(`/blogs/category/${category}`);
};

export const fetchBlogById = (id) => {
  return axiosInstance.get(`/blogs/${id}`);
};

export const likeBlog = (id) => {
  return axiosInstance.post(`/blogs/${id}/like`);
};

export const fetchComments = (id) => {
  return axiosInstance.get(`/comments/blog/${id}`);
};

export const postComment = (id, content) => {
  return axiosInstance.post(`/comments/${id}`, { content });
};

export const reportBlog = (id, reason) => {
  return axiosInstance.post(`/reports/${id}`, { reason });
};

export const updateBlog = (id, formData) => {
  return axiosInstance.put(`/blogs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const deleteBlog = (id) => {
  return axiosInstance.delete(`/blogs/${id}`);
};