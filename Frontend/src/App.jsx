import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Layout component with conditional Navbar/Footer
function AppLayout() {
  const location = useLocation();

  // Define routes where Navbar & Footer should NOT show
  // Only dashboard/internal pages should hide layout
  const hideLayoutRoutes = [
    "/admin/dashboard",
    "/admin/users",
    "/admin/courses",
    "/instructor/dashboard",
    "/instructor/courses/",
    "/student/dashboard",
    "/student/learning",
    "/student/CourseViewer/",
    "/student/CourseCatalog/",
    "/Courses",
    "/student/courses/",
    "/CourseViewer/",
    "/student/StudentLessonView",
    "/student/courses/1",
    "/student/lessons/",
    "/student/",
  ];

  const shouldShowLayout = !hideLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // SPECIAL CASE: Always show layout for home page
  if (location.pathname === "/") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Conditionally render Navbar */}
      {shouldShowLayout && <Navbar />}

      {/* Main Content */}
      <main className={shouldShowLayout ? "flex-grow" : "min-h-screen"}>
        <AppRoutes />
      </main>

      {/* Conditionally render Footer */}
      {shouldShowLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}
