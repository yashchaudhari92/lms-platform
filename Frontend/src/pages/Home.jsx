import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../services/authService";
import Loader from "../components/Loader";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#featured-courses") {
      setTimeout(() => {
        const element = document.getElementById("featured-courses");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  // Dummy courses data - No API call needed
  useEffect(() => {
    const loadDummyCourses = () => {
      try {
        setLoading(true);

        const dummyCourses = [
          {
            id: 1,
            title: "Java Full Stack Development",
            instructorName: "Rajesh Kumar",
            price: 12999,
            originalPrice: 18999,
            rating: 4.8,
            totalStudents: 3247,
            category: "Full Stack",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
            description:
              "Master Java, Spring Boot, React, and MongoDB to become a full-stack developer. Build real-world projects and learn industry best practices.",
            duration: "12 weeks",
            level: "Advanced",
            features: ["Live Projects", "Placement Assistance", "Certificate"],
          },
          {
            id: 2,
            title: "Git & GitHub Masterclass",
            instructorName: "Priya Sharma",
            price: 2999,
            originalPrice: 4999,
            rating: 4.9,
            totalStudents: 1895,
            category: "Development Tools",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250&fit=crop",
            description:
              "Complete guide to version control with Git and collaboration with GitHub. Learn branching, merging, pull requests and open source contributions.",
            duration: "6 weeks",
            level: "Beginner",
            features: ["Hands-on Labs", "Real Projects", "Lifetime Access"],
          },
          {
            id: 3,
            title: "MERN Stack Development",
            instructorName: "Amit Singh",
            price: 14999,
            originalPrice: 21999,
            rating: 4.7,
            totalStudents: 2876,
            category: "Full Stack",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
            description:
              "Build modern web applications with MongoDB, Express.js, React, and Node.js. Full-stack development with latest technologies.",
            duration: "14 weeks",
            level: "Intermediate",
            features: ["6 Projects", "Mentorship", "Job Ready"],
          },
          {
            id: 4,
            title: "Python Data Science",
            instructorName: "Dr. Anjali Mehta",
            price: 11999,
            originalPrice: 16999,
            rating: 4.6,
            totalStudents: 2156,
            category: "Data Science",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=250&fit=crop",
            description:
              "Learn data analysis, machine learning, and visualization with Python. Pandas, NumPy, Matplotlib, and Scikit-learn.",
            duration: "10 weeks",
            level: "Intermediate",
            features: ["Real Datasets", "ML Projects", "Industry Cases"],
          },
          {
            id: 5,
            title: "React Native Mobile Development",
            instructorName: "Vikram Patel",
            price: 9999,
            originalPrice: 14999,
            rating: 4.5,
            totalStudents: 1789,
            category: "Mobile Development",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
            description:
              "Build cross-platform mobile apps for iOS and Android using React Native. Learn state management, navigation, and deployment.",
            duration: "8 weeks",
            level: "Intermediate",
            features: [
              "2 Complete Apps",
              "App Store Deployment",
              "UI/UX Design",
            ],
          },
          {
            id: 6,
            title: "AWS Cloud Practitioner",
            instructorName: "Neha Gupta",
            price: 8999,
            originalPrice: 12999,
            rating: 4.8,
            totalStudents: 3421,
            category: "Cloud Computing",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
            description:
              "Master AWS fundamentals and prepare for certification. EC2, S3, RDS, Lambda, and more with hands-on labs.",
            duration: "8 weeks",
            level: "Beginner",
            features: ["AWS Certification", "Hands-on Labs", "Exam Prep"],
          },
          {
            id: 7,
            title: "UI/UX Design Fundamentals",
            instructorName: "Sanjay Malhotra",
            price: 7999,
            originalPrice: 11999,
            rating: 4.4,
            totalStudents: 1567,
            category: "Design",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
            description:
              "Learn user-centered design principles, wireframing, prototyping, and design tools like Figma and Adobe XD.",
            duration: "6 weeks",
            level: "Beginner",
            features: ["Design Portfolio", "Figma Mastery", "User Research"],
          },
          {
            id: 8,
            title: "DevOps with Docker & Kubernetes",
            instructorName: "Rahul Verma",
            price: 13999,
            originalPrice: 19999,
            rating: 4.7,
            totalStudents: 1987,
            category: "DevOps",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
            description:
              "Containerization with Docker, orchestration with Kubernetes, CI/CD pipelines, and infrastructure as code.",
            duration: "10 weeks",
            level: "Advanced",
            features: [
              "Real Projects",
              "CI/CD Pipelines",
              "Production Deployment",
            ],
          },
          {
            id: 9,
            title: "Machine Learning with Python",
            instructorName: "Dr. Suresh Kumar",
            price: 15999,
            originalPrice: 22999,
            rating: 4.9,
            totalStudents: 2678,
            category: "AI/ML",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
            description:
              "Comprehensive machine learning course covering algorithms, neural networks, deep learning, and real-world applications.",
            duration: "12 weeks",
            level: "Advanced",
            features: ["ML Projects", "TensorFlow/PyTorch", "Model Deployment"],
          },
          {
            id: 10,
            title: "Flutter App Development",
            instructorName: "Anita Desai",
            price: 10999,
            originalPrice: 15999,
            rating: 4.6,
            totalStudents: 1890,
            category: "Mobile Development",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
            description:
              "Build beautiful native apps for iOS and Android with single codebase using Flutter and Dart programming.",
            duration: "9 weeks",
            level: "Intermediate",
            features: [
              "3 Complete Apps",
              "Firebase Integration",
              "State Management",
            ],
          },
          {
            id: 11,
            title: "Cyber Security Fundamentals",
            instructorName: "Capt. Arjun Singh",
            price: 11999,
            originalPrice: 17999,
            rating: 4.8,
            totalStudents: 2345,
            category: "Security",
            approved: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
            description:
              "Learn ethical hacking, network security, cryptography, and security best practices to protect digital assets.",
            duration: "10 weeks",
            level: "Intermediate",
            features: [
              "Hands-on Labs",
              "Security Tools",
              "Vulnerability Assessment",
            ],
          },
        ];

        setCourses(dummyCourses);
        setFeaturedCourses(dummyCourses.slice(0, 9)); // Show 9 featured courses
      } catch (error) {
        console.error("Error loading courses:", error);
        setCourses([]);
        setFeaturedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(() => {
      loadDummyCourses();
    }, 1000);
  }, []);

  // ✅ Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // ✅ Render rating stars
  const renderRating = (rating) => {
    if (!rating || rating === 0) return null;

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
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // Handle enroll button click
  const handleEnrollClick = (courseId) => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      navigate(`/course/${courseId}`);
    } else {
      navigate("/login", {
        state: {
          from: `/course/${courseId}`,
          message: "Please login to enroll in this course",
        },
      });
    }
  };

  // Handle view details
  const handleViewDetails = (courseId) => {
    navigate(`/course-details/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-96">
          <Loader size="lg" text="Loading amazing courses..." />
        </div>
      </div>
    );
  }

  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🎯</span>
            <span>Learn from industry experts</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Advance Your Career With
            <span className="text-blue-600 block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Expert-Led Courses
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Master in-demand skills with our curated collection of professional
            courses taught by industry leaders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <span>📚</span>
                Browse All Courses
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <span>🚀</span>
                Start Learning Today
              </Link>
            )}
            <Link
              to="#featured-courses"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-2"
            >
              <span>🎓</span>
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section
        id="featured-courses"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked courses to boost your career and skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
              >
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                  <img
                    src={course.coverImageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                  {course.originalPrice > course.price && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {Math.round(
                          (1 - course.price / course.originalPrice) * 100
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                      👤
                    </span>
                    {course.instructorName}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        👥 {course.totalStudents.toLocaleString()}
                      </span>
                      {renderRating(course.rating)}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600 block">
                        {formatCurrency(course.price)}
                      </span>
                      {course.originalPrice > course.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(course.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(course.id)}
                      className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 text-center text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEnrollClick(course.id)}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-center text-sm"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {courses.length > 9 && (
            <div className="text-center mt-12">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 text-lg border-2 border-blue-600 px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                View All Courses ({courses.length})<span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{courses.length}+</div>
              <div className="text-blue-100 text-sm font-medium">
                Quality Courses
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25K+</div>
              <div className="text-blue-100 text-sm font-medium">
                Happy Students
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100 text-sm font-medium">
                Expert Instructors
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">94%</div>
              <div className="text-blue-100 text-sm font-medium">
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Learn With Us?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide the best learning experience to help you achieve your
              career goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Expert Instructors",
                description:
                  "Learn from industry professionals with years of real-world experience",
              },
              {
                icon: "📚",
                title: "Quality Content",
                description:
                  "Well-structured courses with hands-on projects and practical exercises",
              },
              {
                icon: "💼",
                title: "Career Focused",
                description:
                  "Skills that are in high demand in today's competitive job market",
              },
              {
                icon: "🔄",
                title: "Lifetime Access",
                description:
                  "Once enrolled, get lifetime access to course materials and updates",
              },
              {
                icon: "🏆",
                title: "Certification",
                description:
                  "Get recognized certificates to showcase your skills to employers",
              },
              {
                icon: "💬",
                title: "Community Support",
                description:
                  "Join our community of learners and get support from peers and mentors",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have advanced their careers with our
            expert-led courses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={currentUser ? "/courses" : "/login"}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2"
            >
              {currentUser ? "🚀 Continue Learning" : "🎯 Get Started Now"}
            </Link>
            <Link
              to="#featured-courses"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
