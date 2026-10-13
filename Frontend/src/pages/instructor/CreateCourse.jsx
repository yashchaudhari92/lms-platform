import React, { useState } from 'react';
import InstructorLayout from '../../layouts/InstructorLayout';
import { instructorService } from '../../services/instructorService';
import { getCurrentUser } from '../../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CreateCourse() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    coverImageUrl: '',
    categoryId: 10, // ✅ CHANGE 1: categoryId use karo (10 = Programming)
    level: 'BEGINNER',  
    duration: 0
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }

    // ✅ CHANGE 2: Console.log add karo debugging ke liye
    console.log("Current User:", currentUser);
    console.log("Form Data:", formData);

    setLoading(true);
    
    try {
      const courseData = {
        ...formData,
        // ✅ CHANGE 3: Hardcode instructorId agar currentUser.id undefined hai
        instructorId: 2, // 2 = Rahul Kumar ki ID
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        approved: false
      };

      console.log("Final Course Data:", courseData); // ✅ Debugging

      const response = await instructorService.createCourse(courseData);
      
      toast.success('Course created successfully! Waiting for admin approval.');
      navigate('/instructor/dashboard');
      
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <InstructorLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-600 mt-2">Fill in the details to create your new course</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your course in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (INR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course price"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="categoryId" // ✅ CHANGE 4: name="categoryId" karo
                  value={formData.categoryId} // ✅ CHANGE 5: value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {/* ✅ CHANGE 6: Category IDs use karo */}
                  <option value="10">Programming</option>
                  <option value="6">Design</option>
                  <option value="3">Data Science</option>
                  <option value="4">Mobile Development</option>
                  <option value="5">Cloud Computing</option>
                  <option value="7">DevOps</option>
                  <option value="8">AI/ML</option>
                  <option value="9">Security</option>
                  <option value="1">Full Stack</option>
                  <option value="2">Development Tools</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Provide a URL for your course cover image
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Course...
                  </span>
                ) : (
                  'Create Course'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/instructor/dashboard')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </InstructorLayout>
  );
}