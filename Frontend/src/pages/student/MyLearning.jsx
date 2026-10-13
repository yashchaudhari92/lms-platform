import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import StudentLayout from "../../layouts/StudentLayout";
import { Link } from "react-router-dom";

export default function MyLearning() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, in-progress,

  useEffect(() => {
    apiClient
      .get("/student/my-courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter courses based on progress
  const filteredCourses = courses.filter((course) => {
    if (filter === "completed") return course.progress >= 100;
    if (filter === "in-progress")
      return course.progress > 0 && course.progress < 100;
    return true;
  });

  const getProgressColor = (progress) => {
    if (progress >= 80) return "from-green-500 to-emerald-500";
    if (progress >= 50) return "from-blue-500 to-cyan-500";
    if (progress >= 25) return "from-yellow-500 to-orange-500";
    return "from-gray-400 to-gray-600";
  };

  const getProgressText = (progress) => {
    if (progress >= 100) return "Course Completed 🎉";
    if (progress >= 80) return "Almost there!";
    if (progress >= 50) return "Halfway done!";
    if (progress >= 25) return "Getting started";
    return "Just begun";
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your courses...</p>
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
          <span className="text-2xl">🎓</span>
          <span className="text-sm text-gray-600">Your Learning Journey</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          My Learning
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Track your progress and continue your educational adventure
        </p>
      </div>

      {/* Stats and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Progress Overview */}
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {courses.length}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {courses.filter((c) => c.progress >= 100).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {
                  courses.filter((c) => c.progress > 0 && c.progress < 100)
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {courses.filter((c) => c.progress === 0).length}
              </div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 bg-gray-100 rounded-2xl p-1">
            {[
              { key: "all", label: "All Courses", icon: "📚" },
              { key: "in-progress", label: "In Progress", icon: "🚀" },
              { key: "completed", label: "Completed", icon: "✅" },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  filter === key
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCourses.map((course) => {
          const progress = course.progress || 0;
          const isCompleted = progress >= 100;
          const isInProgress = progress > 0 && progress < 100;

          return (
            <div
              key={course.id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500"
            >
              {/* Course Header */}
              <div className="h-40 bg-gradient-to-br from-blue-500/20 to-purple-600/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg mb-2">
                    {course.title}
                  </h3>

                  {/* Progress Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isCompleted
                          ? "bg-green-400"
                          : isInProgress
                          ? "bg-yellow-400"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-white/90 text-sm font-medium">
                      {isCompleted
                        ? "Completed"
                        : isInProgress
                        ? "In Progress"
                        : "Not Started"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                  {course.description || "No description available"}
                </p>

                {/* Progress Section */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(
                        progress
                      )} transition-all duration-1000`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {getProgressText(progress)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/student/course/${course.id}`}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 text-center group/continue"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{isCompleted ? "Review" : "Continue"}</span>
                      <span className="group-hover/continue:translate-x-1 transition-transform">
                        {isCompleted ? "📖" : "🚀"}
                      </span>
                    </div>
                  </Link>

                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 group/info">
                    <span className="group-hover/info:scale-110 transition-transform">
                      📊
                    </span>
                  </button>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-3xl transition-all duration-500 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <span className="text-6xl">
              {filter === "completed"
                ? "🎯"
                : filter === "in-progress"
                ? "⏳"
                : "📚"}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {filter === "completed"
              ? "No Completed Courses"
              : filter === "in-progress"
              ? "No Courses in Progress"
              : "No Courses Enrolled"}
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            {filter === "completed"
              ? "Complete some courses to see them here!"
              : filter === "in-progress"
              ? "Start learning to track your progress!"
              : "Enroll in courses to begin your learning journey!"}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>Browse Courses</span>
            <span className="text-lg">✨</span>
          </Link>
        </div>
      )}

      {/* Courses Summary */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200/60">
        <p className="text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredCourses.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">{courses.length}</span>{" "}
          courses
        </p>
      </div>
    </StudentLayout>
  );
}
