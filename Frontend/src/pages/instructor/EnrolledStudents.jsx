import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InstructorLayout from "../../layouts/InstructorLayout";
import { instructorService } from "../../services/instructorService";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

export default function EnrolledStudents() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    loadEnrolledStudents();
  }, [id]);

  // ✅ REAL DATA LOADING
  const loadEnrolledStudents = async () => {
    try {
      setLoading(true);

      // ✅ REAL API CALL FOR COURSE DATA
      const courseData = await instructorService.getCourse(id);
      setCourse(courseData);

      // ✅ REAL API CALL FOR ENROLLED STUDENTS
      const studentsData = await instructorService.getEnrolledStudents(id);

      console.log("Enrolled students data:", studentsData);

      if (studentsData && Array.isArray(studentsData)) {
        setStudents(studentsData);
      } else {
        // Fallback to empty array if no data
        setStudents([]);
        toast.info("No students enrolled yet");
      }
    } catch (error) {
      console.error("Error loading enrolled students:", error);
      toast.error("Failed to load enrolled students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader size="lg" text="Loading enrolled students..." />
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
            <h1 className="text-3xl font-bold text-gray-900">
              Enrolled Students
            </h1>
            <p className="text-gray-600 mt-2">
              {course?.title || "Course"} • {students.length} students enrolled
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {students.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {students.length > 0
                ? Math.round(
                    students.reduce(
                      (sum, student) => sum + (student.progress || 0),
                      0
                    ) / students.length
                  )
                : 0}
              %
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {students.filter((s) => s.progress === 100).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {
                students.filter((s) => s.progress > 0 && s.progress < 100)
                  .length
              }
            </p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Student List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No students enrolled yet
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.name ||
                              student.username ||
                              `Student ${student.id}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email || "No email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(student.enrolledAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${student.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">
                            {student.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.progress === 100
                              ? "bg-green-100 text-green-800"
                              : student.progress > 0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.progress === 100
                            ? "Completed"
                            : student.progress > 0
                            ? "In Progress"
                            : "Not Started"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
}
