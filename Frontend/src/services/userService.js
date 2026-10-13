import apiClient from "./apiClient";

export const getAllUsers = async () => {
  const { data } = await apiClient.get("/users");
  return data;
};

export const getUserById = async (id) => {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await apiClient.put(`/users/${id}`, userData);
  return data;
};
