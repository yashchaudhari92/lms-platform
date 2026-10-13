import apiClient from "./apiClient";

export const getAllCourses = async () => {
  const { data } = await apiClient.get("/courses");
  return data;
};

export const getCourseById = async (id) => {
  const { data } = await apiClient.get(`/courses/${id}`);
  return data;
};

export const createCourse = async (courseData) => {
  const { data } = await apiClient.post("/courses", courseData);
  return data;
};

export const updateCourse = async (id, courseData) => {
  const { data } = await apiClient.put(`/courses/${id}`, courseData);
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await apiClient.delete(`/courses/${id}`);
  return data;
};

// Admin specific endpoints
export const approveCourse = async (courseId) => {
  const { data } = await apiClient.put(`/admin/courses/${courseId}/approve`);
  return data;
};

export const rejectCourse = async (courseId) => {
  const { data } = await apiClient.put(`/admin/courses/${courseId}/reject`);
  return data;
};

export const getPendingCourses = async () => {
  const { data } = await apiClient.get("/admin/courses/pending");
  return data;
};
