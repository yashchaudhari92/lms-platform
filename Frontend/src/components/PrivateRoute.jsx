// src/components/common/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * 🔐 Enhanced PrivateRoute Component
 *
 * Features:
 * ✅ Role-based access control
 * ✅ Smooth redirects with state preservation
 * ✅ Loading states during auth check
 * ✅ Custom unauthorized page
 * ✅ Route history preservation
 *
 * Usage Examples:
 *
 * // Basic authentication only
 * <Route element={<PrivateRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 *
 * // Specific roles only
 * <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
 *   <Route path="/admin" element={<AdminPanel />} />
 * </Route>
 *
 * // Multiple roles allowed
 * <Route element={<PrivateRoute allowedRoles={['ADMIN', 'INSTRUCTOR']} />}>
 *   <Route path="/manage" element={<Management />} />
 * </Route>
 */
export default function PrivateRoute({
  allowedRoles = [],
  redirectTo = "/login",
  unauthorizedRedirectTo = "/unauthorized",
}) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Checking access permissions...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Preserve the attempted URL for redirect after login
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location,
          message: "Please sign in to access this page",
        }}
      />
    );
  }

  // Check role-based access if specific roles are required
  if (allowedRoles.length > 0) {
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
    const hasRequiredRole = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasRequiredRole) {
      // User doesn't have required role, show unauthorized page
      return (
        <Navigate
          to={unauthorizedRedirectTo}
          replace
          state={{
            from: location,
            requiredRoles: allowedRoles,
            userRoles: userRoles,
            message: "You don't have permission to access this page",
          }}
        />
      );
    }
  }

  // User is authenticated and has required roles (if any)
  // Render the child routes
  return <Outlet />;
}

/**
 * 🎯 Usage with React Router v6:
 *
 * // In your router configuration:
 * import PrivateRoute from './components/common/PrivateRoute';
 *
 * <Routes>
 *   {/* Public routes *\/}
 *   <Route path="/" element={<Home />} />
 *   <Route path="/login" element={<Login />} />
 *   <Route path="/signup" element={<Signup />} />
 *
 *   {/* Protected routes - authentication required *\/}
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/profile" element={<Profile />} />
 *   </Route>
 *
 *   {/* Admin only routes *\/}
 *   <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
 *     <Route path="/admin" element={<AdminLayout />}>
 *       <Route path="users" element={<UserManagement />} />
 *       <Route path="analytics" element={<Analytics />} />
 *     </Route>
 *   </Route>
 *
 *   {/* Instructor routes *\/}
 *   <Route element={<PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']} />}>
 *     <Route path="/instructor" element={<InstructorLayout />}>
 *       <Route path="courses" element={<CourseManagement />} />
 *       <Route path="students" element={<StudentList />} />
 *     </Route>
 *   </Route>
 *
 *   {/* Student routes *\/}
 *   <Route element={<PrivateRoute allowedRoles={['STUDENT']} />}>
 *     <Route path="/learn" element={<LearningLayout />}>
 *       <Route path="my-courses" element={<MyCourses />} />
 *       <Route path="progress" element={<Progress />} />
 *     </Route>
 *   </Route>
 *
 *   {/* 404 page *\/}
 *   <Route path="*" element={<NotFound />} />
 * </Routes>
 */

/**
 * 🔧 Optional: Create an Unauthorized page component
 *
 * // src/pages/Unauthorized.jsx
 * import React from "react";
 * import { useLocation, Link } from "react-router-dom";
 *
 * export default function Unauthorized() {
 *   const location = useLocation();
 *   const { requiredRoles = [], userRoles = [] } = location.state || {};
 *
 *   return (
 *     <div className="min-h-screen flex items-center justify-center bg-gray-50">
 *       <div className="max-w-md w-full text-center">
 *         <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
 *           <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 *             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 *           </svg>
 *         </div>
 *         <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
 *         <p className="text-gray-600 mb-6">
 *           You don't have permission to access this page.
 *         </p>
 *         {requiredRoles.length > 0 && (
 *           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
 *             <p className="text-sm text-yellow-800">
 *               <strong>Required Roles:</strong> {requiredRoles.join(', ')}
 *             </p>
 *             <p className="text-sm text-yellow-800 mt-1">
 *               <strong>Your Roles:</strong> {userRoles.join(', ')}
 *             </p>
 *           </div>
 *         )}
 *         <div className="flex gap-4 justify-center">
 *           <Link
 *             to="/"
 *             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
 *           >
 *             Go Home
 *           </Link>
 *           <button
 *             onClick={() => window.history.back()}
 *             className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
 *           >
 *             Go Back
 *           </button>
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 */
