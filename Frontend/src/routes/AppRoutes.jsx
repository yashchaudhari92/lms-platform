import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import UserManagement from "../pages/admin/UserManagement";
import CourseApproval from "../pages/admin/CourseApproval";
import AdminDashboard from "../pages/admin/Dashboard";
import InstructorDashboard from "../pages/instructor/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import CourseViewer from "../pages/student/CourseViewer";
import CourseCatalog from "../pages/student/CourseCatalog";
import MyLearning from "../pages/student/MyLearning";
import StudentLessonView from "../pages/student/StudentLessonView";
import CreateCourse from "../pages/instructor/CreateCourse";
import CourseDetail from "../pages/instructor/CourseDetail";
import AddLesson from "../pages/instructor/AddLesson";
import MyCourses from "../pages/instructor/MyCourses";

import EnrolledStudents from "../pages/instructor/EnrolledStudents";
import MediaUpload from "../pages/instructor/MediaUpload";

export default function AppRoutes() {
  console.log("AppRoutes rendered");

  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("userRole"),
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAuth({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("userRole"),
      });
    };

    const handleLoginEvent = () => {
      handleStorageChange();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("login", handleLoginEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("login", handleLoginEvent);
    };
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!auth.token) {
      // Allow access to home page even if not logged in
      if (window.location.pathname === "/") {
        return children;
      }
      return <Navigate to="/login" replace />;
    }

    const userRole = auth.role?.replace("ROLE_", "");

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  // PublicRoute - for pages that should be accessible without login
  const PublicRoute = ({ children }) => {
    if (auth.token) {
      // If user is logged in, redirect to appropriate dashboard
      const userRole = auth.role?.replace("ROLE_", "");
      switch (userRole) {
        case "ADMIN":
          return <Navigate to="/admin/dashboard" replace />;
        case "INSTRUCTOR":
          return <Navigate to="/instructor/dashboard" replace />;
        case "STUDENT":
          return <Navigate to="/student/dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
    return children;
  };

  return (
    <Routes>
      {/*  HOME ROUTE - Always accessible */}
      <Route path="/" element={<Home />} />
      {/*  PUBLIC ROUTES - Only accessible when NOT logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      {/* ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <CourseApproval />
          </ProtectedRoute>
        }
      />
      {/* INSTRUCTOR ROUTES */}
      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/new"
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <CreateCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/:id"
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <CourseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <MyCourses />
          </ProtectedRoute>
        }
      />
      {/* STUDENT ROUTES */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <CourseCatalog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/learning"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyLearning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/course/:id"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <CourseViewer />
          </ProtectedRoute>
        }
      />
      // Student media lesson view route
      <Route
        path="/student/lessons/:lessonId"
        element={<StudentLessonView />}
      />
      {/* OTHER INSTRUCTOR ROUTES */}
      <Route
        path="/instructor/courses/:id/lessons/new"
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <AddLesson />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/:id/students"
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <EnrolledStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/lessons/:lessonId/edit"
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <AddLesson />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/:id/media"
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <MediaUpload />
          </ProtectedRoute>
        }
      />
      {/*  DEFAULT ROUTE */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
