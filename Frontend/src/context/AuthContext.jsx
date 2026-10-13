// src/context/AuthContext.jsx - FIXED VERSION
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Invalid user data:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      console.log(" Login Successful:", response);

      const { token, role, email, username } = response;

      if (!token) {
        throw new Error("No token received");
      }

      // Process role
      let userRole = role;
      if (role?.includes("ROLE_")) {
        userRole = role.replace("ROLE_", "");
      }

      const userData = {
        token,
        role: userRole,
        email,
        username,
      };

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("userRole", userRole);

      // Update state
      setUser(userData);

      // Trigger storage event for AppRoutes
      window.dispatchEvent(new Event("storage"));

      // Redirect based on role
      setTimeout(() => {
        if (userRole === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
        } else if (userRole === "INSTRUCTOR") {
          navigate("/instructor/dashboard", { replace: true });
        } else if (userRole === "STUDENT") {
          navigate("/student/dashboard", { replace: true });
        }
      }, 100);

      return response;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    setUser(null);

    // Trigger storage event for AppRoutes
    window.dispatchEvent(new Event("storage"));

    navigate("/", { replace: true }); // CHANGE TO HOME instead of login
  };

  const register = async (data) => {
    try {
      //  STEP 1: First register the user
      const response = await authService.register(data);
      console.log("Signup Successful:", response);

      //  STEP 2: Automatically login after successful registration
      const loginResponse = await login({
        email: data.email,
        password: data.password,
      });

      console.log("Auto-login after signup:", loginResponse);
      return loginResponse;
    } catch (error) {
      console.error(" Registration failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
