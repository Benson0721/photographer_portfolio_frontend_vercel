import { axiosInstance } from "./axios_config";

export const register = async (formData) => {
  const response = await axiosInstance.post(`/api/register`, formData);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Register failed" };
};

export const login = async (formData) => {
  const response = await axiosInstance.post(`/api/login`, formData);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Login failed" };
};

export const logout = async () => {
  const response = await axiosInstance.get(`/api/logout`);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Logout failed" };
};

export const checkAuth = async () => {
  const response = await axiosInstance.get(`/api/checkAuth`);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Check auth failed" };
};
