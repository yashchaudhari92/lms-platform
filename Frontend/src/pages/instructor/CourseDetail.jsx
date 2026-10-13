import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import InstructorLayout from "../../layouts/InstructorLayout";
import { instructorService } from "../../services/instructorService";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  // REAL DATA LOADING 
  const loadCourseData = async () => {
    try {
      setLoading(true);

      //  REAL API CALLS
      const courseData = await instructorService.getCourse(id);
      const lessonsData = await instructorService.getLessons(id);

      console.log("Course data:", courseData);
      console.log("Lessons data:", lessonsData);

      setCourse(courseData);
      setLessons(lessonsData || []);
    } catch (error) {
      console.error("Error loading course details:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0 min";
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await instructorService.deleteLesson(lessonId);
        toast.success("Lesson deleted successfully");
        loadCourseData(); // Refresh data
      } catch (error) {
        toast.error("Failed to delete lesson");
      }
    }
  };

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader size="lg" text="Loading course details..." />
        </div>
      </InstructorLayout>
    );
  }

  if (!course) {
    return (
      <InstructorLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Course not found
          </h2>
          <button
            onClick={() => navigate("/instructor/dashboard")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">
              Manage your course content and settings
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link
              to={`/instructor/courses/${id}/lessons/new`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Lessons
            </Link>
            <Link
              to={`/instructor/courses/${id}/students`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View Students
            </Link>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Course Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="mt-1 text-gray-600">
                    {course.description || "No description provided"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <p className="mt-1 text-gray-600">₹{course.price || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <p className="mt-1 text-gray-600">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.approved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.approved ? "Published" : "Pending Approval"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  to={`/instructor/courses/${id}/lessons/new`}
                  className="block w-full text-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Add Lessons
                </Link>
                <Link
                  to={`/instructor/courses/${id}/students`}
                  className="block w-full text-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  View Enrollments
                </Link>
                <Link
                  to={`/instructor/courses/${id}/media`}
                  className="block w-full text-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Upload Media
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Lessons
              </h2>
              <span className="text-sm text-gray-600">
                {lessons.length} lessons
              </span>
            </div>
          </div>

          <div className="p-6">
            {lessons.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No lessons yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding lessons to your course
                </p>
                <Link
                  to={`/instructor/courses/${id}/lessons/new`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add First Lesson
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDuration(lesson.durationSeconds)}
                          {lesson.content &&
                            ` • ${lesson.content.substring(0, 50)}...`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/instructor/lessons/${lesson.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
}
