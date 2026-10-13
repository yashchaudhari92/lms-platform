import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(credentials);
      console.log("✅ Login Successful:", response);

      const token = response.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      const role = response.role?.toUpperCase();
      console.log("User Role from response:", role);

      let finalRole = role;
      if (role?.includes("ROLE_")) {
        finalRole = role.replace("ROLE_", "");
      }

      localStorage.setItem("userRole", finalRole);
      window.dispatchEvent(new Event("login"));

      setTimeout(() => {
        if (finalRole === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
        } else if (finalRole === "INSTRUCTOR") {
          navigate("/instructor/dashboard", { replace: true });
        } else if (finalRole === "STUDENT") {
          navigate("/student/dashboard", { replace: true });
        } else {
          setError("Unknown user role. Please contact administrator.");
        }
      }, 50);
    } catch (err) {
      console.error("❌ Login Failed:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDetails = (role) => {
    const roles = {
      STUDENT: {
        title: "Student Login",
        description: "Access your courses and continue learning",
        icon: "🎓",
        gradient: "from-blue-500 to-cyan-500",
        testEmail: "rohit@lms.com",
        testPassword: "rohit",
      },
      INSTRUCTOR: {
        title: "Instructor Login",
        description: "Manage your courses and students",
        icon: "👨‍🏫",
        gradient: "from-green-500 to-teal-500",
        testEmail: "rahul.ins@lms.com",
        testPassword: "rahul",
      },
      ADMIN: {
        title: "Admin Login",
        description: "Manage platform and users",
        icon: "⚙️",
        gradient: "from-purple-500 to-pink-500",
        testEmail: "rachit.adm@lms.com",
        testPassword: "rachit",
      },
    };
    return roles[role];
  };

  const currentRole = getRoleDetails(selectedRole);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Login Container */}
      <div className="relative w-full max-w-6xl">
        {/* Login Card with Two Columns */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left Column - Role Selection */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="text-center mb-8">
                  <Link to="/" className="inline-flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">LMS</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      LearnPro
                    </span>
                  </Link>
                  <p className="text-blue-100 mt-3">
                    Choose your role to continue
                  </p>
                </div>

                {/* Role Selection Cards */}
                <div className="space-y-4 flex-1">
                  {["STUDENT", "INSTRUCTOR", "ADMIN"].map((role) => {
                    const roleInfo = getRoleDetails(role);
                    const isSelected = selectedRole === role;

                    return (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                          isSelected
                            ? "bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-lg"
                            : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`text-2xl ${
                              isSelected ? "scale-110" : ""
                            } transition-transform`}
                          >
                            {roleInfo.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {roleInfo.title}
                            </h3>
                            <p className="text-blue-100 text-sm mt-1">
                              {roleInfo.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="ml-auto">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-8 pt-6 border-t border-white/20">
                  <p className="text-blue-100">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="font-semibold text-white hover:text-blue-200 transition-colors duration-200 underline"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="p-8 lg:p-12">
              <div className="flex flex-col h-full justify-center">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentRole.title}
                  </h2>
                  <p className="text-gray-600">{currentRole.description}</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-red-700 text-sm font-medium">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Remember me
                      </span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r ${currentRole.gradient} text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <span className="text-lg">{currentRole.icon}</span>
                        Sign In as{" "}
                        {selectedRole.charAt(0) +
                          selectedRole.slice(1).toLowerCase()}
                      </>
                    )}
                  </button>
                </form>

                {/* Test Account Info */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-yellow-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Test Account for {selectedRole}
                      </p>
                      <p className="text-xs text-gray-600">
                        Email:{" "}
                        <span className="font-mono">
                          {currentRole.testEmail}
                        </span>{" "}
                        | Password:{" "}
                        <span className="font-mono">
                          {currentRole.testPassword}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
