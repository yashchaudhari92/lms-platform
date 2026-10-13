import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import * as courseService from "../../services/courseService";

export default function CourseApproval() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    coverImageUrl: "",
    price: 0,
    category: "Programming",
    level: "BEGINNER",
    duration: 0,
  });

  const [editCourseData, setEditCourseData] = useState({
    title: "",
    description: "",
    coverImageUrl: "",
    price: 0,
    category: "Programming",
    level: "BEGINNER",
    duration: 0,
  });

  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (courseId) => {
    try {
      const courseToUpdate = courses.find((c) => c.id === courseId);
      const updatedCourse = await courseService.updateCourse(courseId, {
        title: courseToUpdate.title,
        description: courseToUpdate.description,
        coverImageUrl: courseToUpdate.coverImageUrl || "",
        instructorId: courseToUpdate.instructorId || 1,
        approved: true,
        price: courseToUpdate.price || 0,
        category: courseToUpdate.category || "Programming",
        level: courseToUpdate.level || "BEGINNER",
        duration: courseToUpdate.duration || 0,
        rating: courseToUpdate.rating || 0,
        totalStudents: courseToUpdate.totalStudents || 0,
      });

      setCourses(
        courses.map((course) =>
          course.id === courseId ? updatedCourse : course
        )
      );
    } catch (error) {
      console.error("Error approving course:", error);
      alert("Error approving course: " + error.message);
    }
  };

  const handleReject = async (courseId) => {
    try {
      const courseToUpdate = courses.find((c) => c.id === courseId);
      const updatedCourse = await courseService.updateCourse(courseId, {
        title: courseToUpdate.title,
        description: courseToUpdate.description,
        coverImageUrl: courseToUpdate.coverImageUrl || "",
        instructorId: courseToUpdate.instructorId || 1,
        approved: false,
        price: courseToUpdate.price || 0,
        category: courseToUpdate.category || "Programming",
        level: courseToUpdate.level || "BEGINNER",
        duration: courseToUpdate.duration || 0,
        rating: courseToUpdate.rating || 0,
        totalStudents: courseToUpdate.totalStudents || 0,
      });

      setCourses(
        courses.map((course) =>
          course.id === courseId ? updatedCourse : course
        )
      );
    } catch (error) {
      console.error("Error rejecting course:", error);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter((course) => course.id !== courseId));
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Error deleting course: " + error.message);
      }
    }
  };

  const handleAddCourse = async () => {
    try {
      const courseData = {
        title: newCourse.title,
        description: newCourse.description,
        coverImageUrl: newCourse.coverImageUrl || "",
        instructorId: 1,
        approved: true,
        price: newCourse.price || 0,
        category: newCourse.category || "Programming",
        level: newCourse.level || "BEGINNER",
        duration: newCourse.duration || 0,
        rating: 0,
        totalStudents: 0,
      };

      console.log("Sending course data:", courseData);

      const createdCourse = await courseService.createCourse(courseData);
      setCourses([createdCourse, ...courses]);
      setShowAddCourse(false);
      setNewCourse({
        title: "",
        description: "",
        coverImageUrl: "",
        price: 0,
        category: "Programming",
        level: "BEGINNER",
        duration: 0,
      });
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Error adding course: " + error.message);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setEditCourseData({
      title: course.title,
      description: course.description,
      coverImageUrl: course.coverImageUrl || "",
      price: course.price || 0,
      category: course.category || "Programming",
      level: course.level || "BEGINNER",
      duration: course.duration || 0,
    });
    setShowEditModal(true);
  };

  const handleUpdateCourse = async () => {
    try {
      const updatedCourse = await courseService.updateCourse(editingCourse.id, {
        ...editCourseData,
        instructorId: editingCourse.instructorId || 1,
        approved: editingCourse.approved,
        rating: editingCourse.rating || 0,
        totalStudents: editingCourse.totalStudents || 0,
      });

      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id ? updatedCourse : course
        )
      );
      setShowEditModal(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course: " + error.message);
    }
  };

  const pendingCourses = courses.filter((course) => !course.approved);
  const approvedCourses = courses.filter((course) => course.approved);

  const getStatusBadge = (approved) => {
    if (approved) {
      return (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
          Approved
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
          Pending Review
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">
              Approve, manage, and monitor all courses
            </p>
          </div>
          <button
            onClick={() => setShowAddCourse(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {courses.length}
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {pendingCourses.length}
            </div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {approvedCourses.length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {courses.filter((c) => c.lessons && c.lessons.length > 0).length}
            </div>
            <div className="text-sm text-gray-600">With Lessons</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "pending"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Pending Approval ({pendingCourses.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "approved"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Approved Courses ({approvedCourses.length})
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(activeTab === "pending" ? pendingCourses : approvedCourses).map(
            (course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Course Header */}
                <div
                  className={`p-4 ${
                    course.approved
                      ? "bg-green-50 border-b border-green-200"
                      : "bg-yellow-50 border-b border-yellow-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                      {course.title}
                    </h3>
                    {getStatusBadge(course.approved)}
                  </div>
                  <p className="text-sm text-gray-600">
                    By {course.instructorName || "Unknown Instructor"}
                  </p>
                </div>

                {/* Course Content */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Price</div>
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{course.price || 0}
                      </div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Duration</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {course.duration || 0}h
                      </div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Level</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {course.level || "Beginner"}
                      </div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Students</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {course.totalStudents || 0}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {!course.approved && (
                      <>
                        <button
                          onClick={() => handleApprove(course.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(course.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Empty State */}
        {(activeTab === "pending" ? pendingCourses : approvedCourses).length ===
          0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === "pending"
                ? "No Pending Courses"
                : "No Approved Courses"}
            </h3>
            <p className="text-gray-600">
              {activeTab === "pending"
                ? "All courses have been reviewed and approved."
                : "No courses have been approved yet."}
            </p>
          </div>
        )}

        {/* Add Course Modal */}
        {showAddCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Add New Course</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter course title"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    placeholder="Enter course description"
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newCourse.price}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (hours) *
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newCourse.duration}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level *
                    </label>
                    <select
                      value={newCourse.level}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, level: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCourse.category}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, category: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Personal Development">
                      Personal Development
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newCourse.coverImageUrl}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        coverImageUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddCourse}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Add Course
                </button>
                <button
                  onClick={() => setShowAddCourse(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {showEditModal && editingCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Edit Course</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter course title"
                    value={editCourseData.title}
                    onChange={(e) =>
                      setEditCourseData({
                        ...editCourseData,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    placeholder="Enter course description"
                    value={editCourseData.description}
                    onChange={(e) =>
                      setEditCourseData({
                        ...editCourseData,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={editCourseData.price}
                      onChange={(e) =>
                        setEditCourseData({
                          ...editCourseData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (hours) *
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={editCourseData.duration}
                      onChange={(e) =>
                        setEditCourseData({
                          ...editCourseData,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level *
                    </label>
                    <select
                      value={editCourseData.level}
                      onChange={(e) =>
                        setEditCourseData({
                          ...editCourseData,
                          level: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editCourseData.category}
                    onChange={(e) =>
                      setEditCourseData({
                        ...editCourseData,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Personal Development">
                      Personal Development
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={editCourseData.coverImageUrl}
                    onChange={(e) =>
                      setEditCourseData({
                        ...editCourseData,
                        coverImageUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateCourse}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Update Course
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCourse(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
