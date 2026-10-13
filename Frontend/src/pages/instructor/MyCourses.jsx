import React, { useState, useEffect } from "react";
import InstructorLayout from "../../layouts/InstructorLayout";
import { instructorService } from "../../services/instructorService";
import { getCurrentUser } from "../../services/authService";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const currentUser = getCurrentUser();
      const instructorId = currentUser.id || currentUser.userId || 2;
      const coursesData = await instructorService.getMyCourses(instructorId);
      setCourses(coursesData || []);
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader size="lg" text="Loading your courses..." />
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              My Courses
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view all your created courses
            </p>
          </div>
          <Link
            to="/instructor/courses/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first course
            </p>
            <Link
              to="/instructor/courses/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description || "No description"}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.approved 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {course.approved ? "Published" : "Pending"}
                  </span>
                  <Link
                    to={`/instructor/courses/${course.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}