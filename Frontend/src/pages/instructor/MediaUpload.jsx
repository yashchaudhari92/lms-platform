import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InstructorLayout from "../../layouts/InstructorLayout";
import { toast } from "react-toastify";
import API_BASE_URL from "../../services/apiConfig";

export default function MediaUpload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");

  // Course ke lessons fetch karein
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/lessons/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lessons");
        }

        const lessonsData = await response.json();
        setLessons(lessonsData);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        toast.error("Failed to load lessons");
      }
    };

    fetchLessons();
  }, [id]);

  // Supported file types
  const supportedFormats = {
    image: ["jpg", "jpeg", "png", "gif", "webp"],
    video: ["mp4", "webm", "mov", "avi"],
    audio: ["mp3", "wav", "ogg"],
    document: ["pdf", "doc", "docx", "ppt", "pptx"],
  };

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();

    if (supportedFormats.image.includes(extension)) return "image";
    if (supportedFormats.video.includes(extension)) return "video";
    if (supportedFormats.audio.includes(extension)) return "audio";
    if (supportedFormats.document.includes(extension)) return "document";

    return "other";
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 100MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (getFileType(file.name) === "image") {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!selectedLessonId) {
      toast.error("Please select a lesson to attach the media");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("courseId", id);
      formData.append("lessonId", selectedLessonId); // ✅ Lesson ID add karein

      // Real API call
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      toast.success("File uploaded successfully and attached to lesson!");
      console.log("Uploaded file URL:", result.fileUrl);

      // Reset form
      setSelectedFile(null);
      setSelectedLessonId("");
      setPreviewUrl("");
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileInput = document.getElementById("file-upload");
      fileInput.files = files;
      handleFileSelect({ target: { files } });
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "image":
        return (
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "video":
        return (
          <svg
            className="w-8 h-8 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case "audio":
        return (
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        );
      case "document":
        return (
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
        );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <InstructorLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Upload Media</h1>
            <p className="text-gray-600 mt-2">
              Upload images, videos, audio, or documents for your course lessons
            </p>
          </div>

          {/* Upload Area */}
          <div className="space-y-6">
            {/* Lesson Selector */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Step 1: Select Lesson
              </h3>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              >
                <option value="">Choose a lesson to attach media</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
              {lessons.length === 0 && (
                <p className="text-sm text-blue-700 mt-2">
                  No lessons found for this course. Please create lessons first.
                </p>
              )}
            </div>

            {/* Drag & Drop Zone */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="max-w-md mx-auto">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>

                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      ref={fileInputRef}
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileSelect}
                      accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov,.avi,.mp3,.wav,.ogg,.pdf,.doc,.docx,.ppt,.pptx"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF, MP4, PDF, DOC, PPT up to 100MB
                </p>
              </div>
            </div>

            {/* File Preview */}
            {selectedFile && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(getFileType(selectedFile.name))}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedFile.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedFile.size)} •{" "}
                        {getFileType(selectedFile.name).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl("");
                      setUploadProgress(0);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Image Preview */}
                {previewUrl && (
                  <div className="mt-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-xs rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedLessonId || uploading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Upload Media to Lesson"
                )}
              </button>

              <button
                onClick={() => navigate(`/instructor/courses/${id}`)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
              >
                Back to Course
              </button>
            </div>
          </div>

          {/* Supported Formats Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Supported Formats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-semibold">Images</div>
                <div className="text-sm text-gray-600 mt-1">
                  JPG, PNG, GIF, WebP
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-purple-600 font-semibold">Videos</div>
                <div className="text-sm text-gray-600 mt-1">
                  MP4, WebM, MOV, AVI
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 font-semibold">Audio</div>
                <div className="text-sm text-gray-600 mt-1">MP3, WAV, OGG</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-orange-600 font-semibold">Documents</div>
                <div className="text-sm text-gray-600 mt-1">PDF, DOC, PPT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
}
