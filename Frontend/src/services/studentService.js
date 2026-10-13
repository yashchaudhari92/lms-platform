import apiClient from "./apiClient";

const studentService = {
  async enrollCourse(courseId) {
    const response = await apiClient.post(`/student/enroll/${courseId}`);
    return response.data;
  },

  async getEnrolledCourses() {
    const response = await apiClient.get("/student/my-courses");
    return response.data;
  },

  async getAvailableCourses() {
    const response = await apiClient.get("/student/courses/available");
    return response.data;
  },

  async getCourseWithProgress(courseId) {
    const response = await apiClient.get(`/student/course/${courseId}`);
    return response.data;
  },

  async markLessonCompleted(courseId, lessonId) {
    const response = await apiClient.post(
      `/student/course/${courseId}/lesson/${lessonId}/complete`
    );
    return response.data;
  },

  async getLearningStats() {
    const response = await apiClient.get("/student/stats");
    return response.data;
  },
};

export default studentService;
