import apiClient from "./apiClient";

export const instructorService = {
  //  COURSE MANAGEMENT - WITH ERROR HANDLING
  createCourse: async (courseData) => {
    try {
      const { data } = await apiClient.post("/instructor/courses", courseData);
      return data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  // instructorService.js mein yeh add karo
  getEnrolledStudents: async (courseId) => {
    try {
      const { data } = await apiClient.get(
        `/instructor/courses/${courseId}/students`
      );
      return data;
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      return []; // Return empty array on error
    }
  },

  getMyCourses: async (instructorId) => {
    try {
      const { data } = await apiClient.get(
        `/instructor/${instructorId}/courses`
      );
      return data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  getCourse: async (courseId) => {
    try {
      const { data } = await apiClient.get(`/instructor/courses/${courseId}`);
      return data;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  },

  //  LESSON MANAGEMENT - WITH ERROR HANDLING
  addLesson: async (courseId, lessonData) => {
    try {
      const { data } = await apiClient.post(
        `/instructor/courses/${courseId}/lessons`,
        lessonData
      );
      return data;
    } catch (error) {
      console.error("Error adding lesson:", error);
      throw error;
    }
  },

  getLessons: async (courseId) => {
    try {
      const { data } = await apiClient.get(
        `/instructor/courses/${courseId}/lessons`
      );
      return data;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return []; // Return empty array instead of throwing
    }
  },

  deleteLesson: async (lessonId) => {
    try {
      const { data } = await apiClient.delete(
        `/instructor/lessons/${lessonId}`
      );
      return data;
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw error;
    }
  },
};

export default instructorService;
