import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { toast } from "react-toastify";
import API_BASE_URL, {
  API_ORIGIN,
} from "../../services/apiConfig";

export default function StudentLessonView() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {

        const response = await fetch(
          `${API_BASE_URL}/lessons/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );


        if (!response.ok) {
          throw new Error("Failed to fetch lesson");
        }

        const lessonData = await response.json();
        setLesson(lessonData);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        toast.error("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const renderMedia = () => {
    if (!lesson?.mediaUrl) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700">No media attached to this lesson</p>
        </div>
      );
    }

    const fileUrl = lesson.mediaUrl.startsWith("/uploads/")
      ? `${API_ORIGIN}${lesson.mediaUrl}`
      : lesson.mediaUrl;
    const fileType = fileUrl.split(".").pop().toLowerCase();

    // Image files
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Attached Image
          </h3>
          <img
            src={fileUrl}
            alt="Lesson Media"
            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
          <div className="mt-3 text-center">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Open image in new tab
            </a>
          </div>
        </div>
      );
    }

    // Video files
    else if (["mp4", "webm", "mov", "avi"].includes(fileType)) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Attached Video
          </h3>
          <video
            src={fileUrl}
            controls
            className="w-full max-w-2xl mx-auto rounded-lg"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
          <div className="mt-3 text-center">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Download video
            </a>
          </div>
        </div>
      );
    }

    // PDF files
    else if (fileType === "pdf") {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Attached Document
          </h3>
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-3"
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
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>Open PDF Document</span>
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
        </div>
      );
    }

    // Other files
    else {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Attached File
          </h3>
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-gray-500 mx-auto mb-3"
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
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>Download File</span>
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
        </div>
      );
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (!lesson) {
    return (
      <StudentLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center text-red-600">Lesson not found</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {lesson.title}
          </h1>
          <div className="prose max-w-none text-gray-700 mb-6">
            {lesson.content || "No content available for this lesson."}
          </div>
        </div>

        {/* Media Display Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Lesson Media
          </h2>
          {renderMedia()}
        </div>
      </div>
    </StudentLayout>
  );
}
