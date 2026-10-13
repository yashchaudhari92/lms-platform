import apiClient from "./apiClient";

export const getLessonsByCourse = async (courseId) => {
  const { data } = await apiClient.get(`/lessons/course/${courseId}`);
  return data;
};

export const createLesson = async (courseId, lessonData) => {
  const { data } = await apiClient.post(
    `/lessons/course/${courseId}`,
    lessonData
  );
  return data;
};

export const updateLesson = async (lessonId, lessonData) => {
  const { data } = await apiClient.put(`/lessons/${lessonId}`, lessonData);
  return data;
};

export const deleteLesson = async (lessonId) => {
  const { data } = await apiClient.delete(`/lessons/${lessonId}`);
  return data;
};
