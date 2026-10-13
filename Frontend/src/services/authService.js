import apiClient from "./apiClient";

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    console.log("Login API Response:", response.data);

    if (response.data && response.data.token) {
      //  Store everything in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("username", response.data.username);

      return response.data;
    }

    throw new Error(response.data?.message || "Login failed");
  } catch (error) {
    console.error("Login service error:", error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw error;
    } else {
      throw new Error("Network error. Please try again.");
    }
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post("/auth/signup", userData);
    console.log("Register API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration service error:", error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Registration failed. Please try again.");
    }
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("username");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  return token
    ? {
        token,
        role,
        email,
        username,
        id: userId ? parseInt(userId) : null, // ✅ Include user ID
      }
    : null;
};
