import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Browse Courses", path: "/#featured-courses" },
        { name: "Instructor Dashboard", path: "/instructor/dashboard" },
        { name: "Student Dashboard", path: "/student/dashboard" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Contact Us", path: "/contact" },
        { name: "Privacy Policy", path: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-xl text-gray-900">LearnPro</span>
            </Link>
            <p className="text-gray-600 max-w-md text-sm leading-relaxed">
              Empowering learners and educators with modern online learning
              technology. Transform your educational journey with LearnPro.
            </p>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © {currentYear} LearnPro. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/contact"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
