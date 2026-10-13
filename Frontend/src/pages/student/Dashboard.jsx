import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import StudentLayout from "../../layouts/StudentLayout";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError("");

        // Use correct API endpoints
        const [statsResponse, coursesResponse] = await Promise.all([
          apiClient.get("/student/stats"),
          apiClient.get("/student/my-courses"),
        ]);

        console.log("📊 Stats API Response:", statsResponse.data);
        console.log("📚 Courses API Response:", coursesResponse.data);

        setStats(statsResponse.data || {});

        // Take only first 3 courses for "recent courses"
        const courses = coursesResponse.data || [];
        setRecentCourses(courses.slice(0, 3));
      } catch (err) {
        console.error("❌ Dashboard API Error:", err);
        setError("Failed to load dashboard data");

        // Fallback empty data
        setStats({});
        setRecentCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Enhanced Progress Circle with Animation
  const ProgressCircle = ({ percentage, size = 100, color = "blue" }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      purple: "from-purple-500 to-pink-500",
      orange: "from-orange-500 to-red-500",
    };

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${color})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient
              id={`gradient-${color}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" className={`text-${color}-500`} />
              <stop offset="100%" className={`text-${color}-500`} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* Enhanced Header Section */}
      <div className="mb-8 text-center lg:text-left">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 rounded-2xl shadow-sm border border-gray-200/60 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Learning in progress</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Welcome back! 👋
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">⚠️</span>
            </div>
            <div>
              <p className="text-yellow-800 font-medium">{error}</p>
              <p className="text-yellow-700 text-sm mt-1">
                Showing placeholder data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Enrolled Courses
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalCourses || recentCourses.length || 0}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Active learning</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-2xl text-white">📚</span>
            </div>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Completed Lessons
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.completedLessons || 0}
              </h3>
              <p className="text-xs text-green-600 font-medium mt-1">
                Keep learning!
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-2xl text-white">✅</span>
            </div>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-purple-200">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Overall Progress
            </p>
            <ProgressCircle
              percentage={stats.progressPercentage || 0}
              size={80}
              color="purple"
            />
            <p className="text-xs text-gray-500 mt-3">Your learning journey</p>
          </div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Certificates
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.certificates || 0}
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-1">
                Achievements earned
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-2xl text-white">🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Continue Learning Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Continue Learning
            </h2>
            <p className="text-gray-600">Pick up where you left off</p>
          </div>
          <Link
            to="/student/learning"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 mt-4 lg:mt-0"
          >
            <span>View All Courses</span>
            <span className="text-lg">→</span>
          </Link>
        </div>

        {recentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentCourses.map((course, index) => (
              <div
                key={course.id}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-blue-200"
              >
                <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-500">
                  {course.coverImageUrl ? (
                    <img
                      src={course.coverImageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-4xl opacity-70 group-hover:opacity-100 transition-opacity">
                      📖
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {course.title}
                  </h3>
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {course.progress || 0}%
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.description || "Continue your learning journey"}
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>

                <Link
                  to={`/student/course/${course.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group/btn"
                >
                  <span>Continue Learning</span>
                  <span className="group-hover/btn:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Start Your Learning Journey
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Enroll in your first course and begin your path to mastery
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
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/60">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Get support for your learning journey
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Contact Support →
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/60">
          <h3 className="font-semibold text-gray-900 mb-2">
            Upcoming Deadlines
          </h3>
          <p className="text-gray-600 text-sm mb-4">No pending assignments</p>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
            View Calendar →
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/60">
          <h3 className="font-semibold text-gray-900 mb-2">
            Learning Resources
          </h3>
          <p className="text-gray-600 text-sm mb-4">Access study materials</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
            Explore Resources →
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}
