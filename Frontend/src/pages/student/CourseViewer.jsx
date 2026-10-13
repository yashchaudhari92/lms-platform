import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";
import StudentLayout from "../../layouts/StudentLayout";

export default function CourseViewer() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    apiClient
      .get(`/student/course/${id}`)
      .then((res) => {
        console.log("API DATA:", res.data);
        setData(res.data);
        if (res.data.lessons && res.data.lessons.length > 0) {
          setActiveLesson(res.data.lessons[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const completeLesson = async (lessonId) => {
    setCompleting(lessonId);
    try {
      await apiClient.post(`/student/course/${id}/lesson/${lessonId}/complete`);

      // Update local state
      setData((prev) => ({
        ...prev,
        completedLessonIds: [...(prev.completedLessonIds || []), lessonId],
      }));

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-right duration-500";
      successMsg.innerHTML = "Lesson Completed!";
      document.body.appendChild(successMsg);

      setTimeout(() => {
        successMsg.remove();
      }, 2000);
    } catch (err) {
      const errorMsg = document.createElement("div");
      errorMsg.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-right duration-500";
      errorMsg.innerHTML = ` ${
        err.response?.data?.message || "Failed to complete lesson"
      }`;
      document.body.appendChild(errorMsg);

      setTimeout(() => {
        errorMsg.remove();
      }, 3000);
    } finally {
      setCompleting(null);
    }
  };

  const renderMedia = (mediaUrl) => {
    if (!mediaUrl) return null;

    const fileType = mediaUrl.split(".").pop().toLowerCase();

    // Image files
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
      return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex justify-center">
            <img
              src={mediaUrl}
              alt="Lesson Media"
              className="max-w-full h-auto rounded-lg shadow-md max-h-96 object-contain"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x600/3b82f6/ffffff?text=Image+Not+Found";
              }}
            />
          </div>
          <div className="mt-3 text-center">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <span>Open image in new tab</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      );
    }

    // Video files
    else if (["mp4", "webm", "mov", "avi"].includes(fileType)) {
      return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="rounded-2xl overflow-hidden bg-black">
            <video
              controls
              className="w-full aspect-video"
              poster={`https://via.placeholder.com/800x450/3b82f6/ffffff?text=${encodeURIComponent(
                activeLesson.title
              )}`}
            >
              <source src={mediaUrl} type={`video/${fileType}`} />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-3 text-center">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <span>Download video</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
          </div>
        </div>
      );
    }

    // PDF files
    else if (fileType === "pdf") {
      return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
            <svg
              className="w-16 h-16 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-700 mb-4 text-center">
              PDF document attached to this lesson
            </p>
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>Open PDF Document</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      );
    }

    // Other files
    else {
      return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
            <svg
              className="w-16 h-16 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-700 mb-4 text-center">
              File attached to this lesson
            </p>
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>Download File</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course content...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (!data) {
    return (
      <StudentLayout>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600">
            The course you're looking for doesn't exist.
          </p>
        </div>
      </StudentLayout>
    );
  }

  const { course, lessons, completedLessonIds = [], progress = 0 } = data;
  const completedCount = completedLessonIds.length;
  const totalLessons = lessons.length;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-8 mb-8 border border-blue-200/60">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full text-sm text-gray-600 mb-4">
                <span>📚</span>
                <span>Course in Progress</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {course.description}
              </p>

              {/* Progress Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {completedCount}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="font-semibold text-gray-900">Lessons</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <span className="text-green-600 font-bold">
                      {totalLessons}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-gray-900">Lessons</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <span className="text-purple-600 font-bold">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Course</p>
                    <p className="font-semibold text-gray-900">Progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="lg:text-center">
              <div className="relative w-32 h-32 mx-auto">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (progress / 100) * 251.2}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Overall Progress</p>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Lessons Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📋</span>
                Course Content
              </h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isActive = activeLesson?.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? "bg-blue-50 border border-blue-200 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isActive
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          }`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm truncate ${
                              isActive ? "text-blue-700" : "text-gray-700"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isCompleted ? "Completed" : "Not started"}
                          </p>
                        </div>
                        {isCompleted && (
                          <span className="text-green-500 text-lg">✅</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">
                    {completedCount}/{totalLessons} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(completedCount / totalLessons) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="xl:col-span-3">
            {activeLesson ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 overflow-hidden">
                {/* Lesson Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 p-6 border-b border-gray-200/60">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📖</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {activeLesson.title}
                      </h2>
                      <p className="text-gray-600">
                        Lesson{" "}
                        {lessons.findIndex((l) => l.id === activeLesson.id) + 1}{" "}
                        of {totalLessons}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lesson Media */}
                {/* {activeLesson.mediaUrl && (
                  <div className="p-6 border-b border-gray-200/60">
                    <div className="rounded-2xl overflow-hidden bg-black">
                      <video 
                        controls 
                        className="w-full aspect-video"
                        poster={`https://via.placeholder.com/800x450/3b82f6/ffffff?text=${encodeURIComponent(activeLesson.title)}`}
                      >
                        <source src={activeLesson.mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )} */}
                {/* Lesson Media */}
                {activeLesson.mediaUrl && (
                  <div className="p-6 border-b border-gray-200/60">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📎</span>
                      Lesson Media
                    </h3>
                    {renderMedia(activeLesson.mediaUrl)}
                  </div>
                )}

                {/* Lesson Content */}
                {activeLesson.content && (
                  <div className="p-6 border-b border-gray-200/60">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {activeLesson.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Lesson Actions */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-3">
                      {completedLessonIds.includes(activeLesson.id) ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <span className="text-xl">✅</span>
                          <span className="font-medium">Lesson Completed</span>
                        </div>
                      ) : (
                        <span className="text-gray-600">
                          Mark this lesson as completed
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => completeLesson(activeLesson.id)}
                      disabled={
                        completedLessonIds.includes(activeLesson.id) ||
                        completing === activeLesson.id
                      }
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-48 group/complete"
                    >
                      {completing === activeLesson.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Marking...</span>
                        </div>
                      ) : completedLessonIds.includes(activeLesson.id) ? (
                        <div className="flex items-center justify-center gap-2">
                          <span>Completed</span>
                          <span>🎉</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Mark as Complete</span>
                          <span className="group-hover/complete:scale-110 transition-transform">
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Select a Lesson
                </h3>
                <p className="text-gray-600">
                  Choose a lesson from the sidebar to start learning
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
