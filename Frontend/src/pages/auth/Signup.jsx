import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (error) setError("");

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    const colors = {
      0: "bg-gray-200",
      1: "bg-red-500",
      2: "bg-orange-500",
      3: "bg-yellow-500",
      4: "bg-green-500",
    };
    return colors[passwordStrength] || colors[0];
  };

  const getPasswordStrengthText = () => {
    const texts = {
      0: "Very Weak",
      1: "Weak",
      2: "Fair",
      3: "Good",
      4: "Strong",
    };
    return texts[passwordStrength] || texts[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        username: form.username,
        email: form.email,
        password: form.password,
        // role: "ROLE_STUDENT"
      };

      console.log("📤 Sending signup data:", signupData);

      const response = await register(signupData);
      console.log("✅ Signup successful:", response);

      // setTimeout(() => {
      //   navigate("/login", {
      //     replace: true,
      //     state: {
      //       success: true,
      //       message: "Student account created successfully! Please login."
      //     }
      //   });
      // }, 1000);
    } catch (err) {
      console.error("❌ Signup failed:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Signup Container */}
      <div className="relative w-full max-w-4xl">
        {/* Signup Card with Two Columns */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
            {/* Left Column - Student Benefits */}
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
                    Start your learning journey today!
                  </p>
                </div>

                {/* Student Benefits */}
                <div className="space-y-6 flex-1">
                  <h3 className="text-xl font-bold text-center mb-6">
                    Why Join as Student?
                  </h3>

                  {[
                    {
                      icon: "📚",
                      title: "1000+ Courses",
                      description: "Access unlimited learning materials",
                    },
                    {
                      icon: "🎯",
                      title: "Learn Anywhere",
                      description: "Study at your own pace, anytime",
                    },
                    {
                      icon: "🏆",
                      title: "Get Certified",
                      description: "Earn recognized certificates",
                    },
                    {
                      icon: "👥",
                      title: "Join Community",
                      description: "Connect with fellow learners",
                    },
                    {
                      icon: "💼",
                      title: "Career Growth",
                      description: "Boost your career prospects",
                    },
                    {
                      icon: "🔄",
                      title: "Lifetime Access",
                      description: "Learn whenever you want",
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm"
                    >
                      <div className="text-2xl">{benefit.icon}</div>
                      <div>
                        <h4 className="font-semibold">{benefit.title}</h4>
                        <p className="text-blue-100 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Already have account */}
                <div className="text-center mt-8 pt-6 border-t border-white/20">
                  <p className="text-blue-100">
                    Already a student?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-white hover:text-blue-200 transition-colors duration-200 underline"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Signup Form */}
            <div className="p-8 lg:p-12">
              <div className="flex flex-col h-full justify-center">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Join as Student
                  </h2>
                  <p className="text-gray-600">
                    Create your free student account
                  </p>
                </div>

                {/* Student Badge */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-lg">🎓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Student Registration
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Start learning from industry experts today
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signup Form */}
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

                  {/* Username Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Username *
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address *
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
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Password *
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
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                        placeholder="Create a strong password"
                      />
                    </div>

                    {/* Password Strength Meter */}
                    {form.password && (
                      <div className="space-y-2 animate-in fade-in duration-300">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">
                            Password strength:
                          </span>
                          <span
                            className={`font-medium ${
                              passwordStrength === 0
                                ? "text-gray-500"
                                : passwordStrength === 1
                                ? "text-red-500"
                                : passwordStrength === 2
                                ? "text-orange-500"
                                : passwordStrength === 3
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                            style={{
                              width: `${(passwordStrength / 4) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !agreedToTerms}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Student Account...
                      </>
                    ) : (
                      <>
                        <span className="text-lg">🎓</span>
                        Create Student Account
                      </>
                    )}
                  </button>
                </form>

                {/* Security Note */}
                <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-xs text-gray-600">
                      Your data is securely encrypted and protected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Student registration only • Free forever • Start learning in minutes
          </p>
        </div>
      </div>
    </div>
  );
}
