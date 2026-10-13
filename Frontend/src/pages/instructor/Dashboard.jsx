import React, { useEffect, useState } from "react";
import InstructorLayout from "../../layouts/InstructorLayout";
import { instructorService } from "../../services/instructorService";
import { getCurrentUser } from "../../services/authService";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    averageRating: 0,
    publishedCourses: 0,
    pendingCourses: 0,
  });

  // ✅ Data Loading - Same functionality
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();

      if (!currentUser) {
        toast.error("Please login to access dashboard");
        return;
      }

      const instructorId =
        currentUser.id || currentUser.userId || currentUser.sub || 2;
      const coursesData = await instructorService.getMyCourses(instructorId);

      if (coursesData && Array.isArray(coursesData)) {
        setCourses(coursesData);

        const totalStudents = coursesData.reduce(
          (sum, course) => sum + (course.enrollmentCount || 0),
          0
        );
        const totalEarnings = coursesData.reduce(
          (sum, course) => sum + (course.price || 0),
          0
        );
        const publishedCourses = coursesData.filter(
          (course) => course.approved
        ).length;
        const pendingCourses = coursesData.filter(
          (course) => !course.approved
        ).length;

        setStats({
          totalCourses: coursesData.length,
          totalStudents: totalStudents,
          totalEarnings: totalEarnings,
          averageRating: 4.5,
          publishedCourses: publishedCourses,
          pendingCourses: pendingCourses,
        });
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (err.response?.status === 404) {
        setCourses([]);
      } else {
        toast.error("Failed to load courses data.");
      }
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ✅ Helper Functions
  const getCourseStatus = (course) => {
    return course.approved ? "published" : "pending";
  };

  const getStatusColor = (status) => {
    const colors = {
      published: "bg-green-100 text-green-800 border border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      draft: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    return colors[status] || colors.draft;
  };

  const getStatusText = (course) => {
    return course.approved ? "Published" : "Pending Approval";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const renderRating = (rating) => {
    if (!rating || rating === 0) {
      return (
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <span>No ratings</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader size="lg" text="Loading your teaching dashboard..." />
        </div>
      </InstructorLayout>
    );
  }

  const currentUser = getCurrentUser();

  return (
    <InstructorLayout>
      <div className="space-y-6">
        {/* Admin Style */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back
              {currentUser?.username ? `, ${currentUser.username}` : ""}!
              {courses.length > 0
                ? ` You have ${courses.length} courses`
                : " Start by creating your first course!"}
            </p>
          </div>
          <Link
            to="/instructor/courses/new"
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create New Course
          </Link>
        </div>

        {/* Admin Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Courses Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalCourses}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-green-600">
                    {stats.publishedCourses} published
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-yellow-600">
                    {stats.pendingCourses} pending
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Students Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalStudents}
                </p>
                <p className="text-sm text-gray-500 mt-2">Across all courses</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Rating Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {renderRating(stats.averageRating)}
                </div>
                <p className="text-sm text-gray-500 mt-2">Student feedback</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.totalEarnings)}
                </p>
                <p className="text-sm text-gray-500 mt-2">All time earnings</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/*  Admin Style */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Courses
              </h2>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-sm text-gray-600">
                  {stats.publishedCourses} Published • {stats.pendingCourses}{" "}
                  Pending
                </span>
              </div>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Start creating amazing learning experiences for your students.
                Your first course is just a click away!
              </p>
              <Link
                to="/instructor/courses/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Your First Course
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    {/* Course Image */}
                    <div className="h-40 bg-gray-200 overflow-hidden">
                      <img
                        src={
                          course.coverImageUrl ||
                          `https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=${encodeURIComponent(
                            course.title || "Course"
                          )}`
                        }
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Course`;
                        }}
                      />
                    </div>

                    {/* Course Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                getCourseStatus(course)
                              )}`}
                            >
                              {getStatusText(course)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      {/* Course Description */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description || "No description available"}
                      </p>

                      {/* Course Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          {course.enrollmentCount || 0} students
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(course.price || 0)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          to={`/instructor/courses/${course.id}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors text-center"
                        >
                          Manage
                        </Link>
                        <Link
                          to={`/instructor/courses/${course.id}/lessons/new`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors text-center"
                        >
                          Add Lessons
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
}
