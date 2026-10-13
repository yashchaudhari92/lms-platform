import apiClient from "./apiClient";

// User Management
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/admin/users", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || "ROLE_STUDENT",
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.put(
      `/admin/users/${userId}/role?role=${role}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Dashboard Statistics
export const getAdminStats = async () => {
  try {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await apiClient.get("/admin/activity");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    throw error;
  }
};

// Course Management
export const getPendingCourses = async () => {
  try {
    const response = await apiClient.get("/admin/courses/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending courses:", error);
    throw error;
  }
};

export const approveCourse = async (courseId) => {
  try {
    const response = await apiClient.put(`/admin/courses/${courseId}/approve`);
    return response.data;
  } catch (error) {
    console.error("Error approving course:", error);
    throw error;
  }
};

export const rejectCourse = async (courseId) => {
  try {
    const response = await apiClient.put(`/admin/courses/${courseId}/reject`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting course:", error);
    throw error;
  }
};
