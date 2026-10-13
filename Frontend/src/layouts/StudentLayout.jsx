import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/student/dashboard",
      icon: "📊",
      desc: "Overview & Analytics",
    },
    {
      title: "Browse Courses",
      path: "/Courses",
      icon: "🔍",
      desc: "Discover New Courses",
    },
    {
      title: "My Learning",
      path: "/student/learning",
      icon: "📚",
      desc: "Your Courses & Progress",
    },
    {
      title: "Achievements",
      path: "/student/achievements",
      icon: "🏆",
      desc: "Certificates & Badges",
    },
  ];

  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Enhanced Sidebar - FIXED OVERLAP ISSUE */}
      <div
        className={`bg-white/95 backdrop-blur-xl w-80 shadow-2xl fixed lg:static h-full transform transition-all duration-500 z-50 border-r border-gray-200/60 flex flex-col ${
          isSidebarOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🎓</span>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Learning Hub
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Student Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - FIXED: Added flex-1 and overflow-auto */}
        <nav className="p-6 space-y-3 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-blue-200/50 ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg shadow-blue-100/50 border-blue-200 text-blue-700"
                  : "text-gray-600 hover:bg-white hover:shadow-lg hover:text-gray-900"
              }`}
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>
              <div className="flex-1">
                <span className="font-semibold block leading-tight">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.desc}
                </span>
              </div>
              {location.pathname === item.path && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer - FIXED: Removed absolute and added mt-auto */}
        <div className="p-6 border-t border-gray-200/60 bg-white/80 mt-auto">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-slate-100 to-blue-50 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              {/* Use username instead of name */}
              <span className="text-white font-bold text-sm">
                {user?.username?.charAt(0) || "S"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              {/*  Use username instead of name */}
              <p className="font-semibold text-gray-800 text-sm truncate">
                {user?.username || "Student"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-200"
          >
            <span className="text-lg transition-transform duration-300 group-hover:scale-110">
              🚪
            </span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 min-w-0 flex flex-col">
        {/* Enhanced Header */}
        <header
          className={`bg-white/80 backdrop-blur-xl border-b border-gray-200/60 lg:static sticky top-0 z-40 transition-all duration-300 ${
            scrolled ? "shadow-lg shadow-black/5" : "shadow-sm"
          }`}
        >
          <div className="flex justify-between items-center p-4 lg:px-6">
            {/* Mobile Menu & Welcome */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 rounded-2xl hover:bg-gray-100 lg:hidden transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                <span className="text-xl">☰</span>
              </button>
              <div className="hidden sm:block">
                {/*  Use username instead of name */}
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Welcome back, {user?.username || "Student"}! 👋
                </h1>
                <p className="text-gray-600 text-sm">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>

            {/* Enhanced Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-100 transition-all duration-300 group border border-transparent hover:border-gray-200"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    {/*  Use username instead of name */}
                    <span className="text-white font-bold text-sm">
                      {user?.username?.charAt(0) || "S"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden md:block text-left">
                  {/* Use username instead of name */}
                  <p className="font-semibold text-gray-800 text-sm">
                    {user?.username || "Student"}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
                <span className="text-gray-400 transition-transform duration-300">
                  ▼
                </span>
              </button>

              {/* Enhanced Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-14 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 min-w-64 py-3 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                  <div className="px-4 py-3 border-b border-gray-200/60">
                    {/*  Use username instead of name */}
                    <p className="font-bold text-gray-900">
                      {user?.username || "Student"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email || ""}
                    </p>
                  </div>

                  <Link
                    to="/student/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-all duration-200 group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      👤
                    </span>
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/student/settings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-all duration-200 group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      ⚙️
                    </span>
                    <span>Settings</span>
                  </Link>

                  <div className="border-t border-gray-200/60 mt-2 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">
                        🚪
                      </span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Enhanced Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
