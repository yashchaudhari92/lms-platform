import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import StudentLayout from "../../layouts/StudentLayout";

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    apiClient
      .get("/student/courses/available")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const enrollCourse = async (courseId) => {
    setEnrolling(courseId);
    try {
      await apiClient.post(`/student/enroll/${courseId}`);

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-right duration-500";
      successMsg.innerHTML = "Enrolled Successfully!";
      document.body.appendChild(successMsg);

      setTimeout(() => {
        successMsg.remove();
        // Update courses list without reload
        setCourses((prev) => prev.filter((course) => course.id !== courseId));
      }, 2000);
    } catch (err) {
      const errorMsg = document.createElement("div");
      errorMsg.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-right duration-500";
      errorMsg.innerHTML = `❌ ${
        err.response?.data?.message || "Enrollment Failed"
      }`;
      document.body.appendChild(errorMsg);

      setTimeout(() => {
        errorMsg.remove();
      }, 3000);
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Discovering amazing courses...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* Enhanced Header */}
      <div className="text-center lg:text-left mb-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 rounded-2xl shadow-sm border border-gray-200/60 mb-6">
          <span className="text-2xl">🎯</span>
          <span className="text-sm text-gray-600">Discover new skills</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Course Catalog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Explore our curated collection of courses and start your learning
          journey
        </p>
      </div>

      {/* Enhanced Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500"
          >
            {/* Course Image/Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-600/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-white/90 text-sm">
                    {course.rating || 4.5}
                  </span>
                  <span className="text-white/70 text-sm">•</span>
                  <span className="text-white/90 text-sm">
                    {course.level || "All Levels"}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                {course.description || "No description available"}
              </p>

              {/* Course Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <span>👨‍🏫</span>
                  <span>{course.instructor?.name || "Expert Instructor"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{course.duration || "Self-paced"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => enrollCourse(course.id)}
                  disabled={enrolling === course.id}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/enroll"
                >
                  {enrolling === course.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enrolling...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Enroll Now</span>
                      <span className="group-hover/enroll:translate-x-1 transition-transform">
                        🎯
                      </span>
                    </div>
                  )}
                </button>

                <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 group/info">
                  <span className="group-hover/info:scale-110 transition-transform">
                    ℹ️
                  </span>
                </button>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-3xl transition-all duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <span className="text-6xl">🎓</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            All Courses Enrolled!
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            You've enrolled in all available courses. Check back later for new
            content!
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:shadow-lg transition-all duration-300">
              Refresh Page
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300">
              Contact Support
            </button>
          </div>
        </div>
      )}

      {/* Courses Count */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200/60">
        <p className="text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">{courses.length}</span>{" "}
          available courses
        </p>
      </div>
    </StudentLayout>
  );
}
