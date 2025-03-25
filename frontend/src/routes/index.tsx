import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { routes, RouteConfig } from './RouteConfig';
import MainLayout from '../components/layouts/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import { useAuth } from '../contexts/authContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if route requires specific roles and if user has the required role
  if (allowedRoles && allowedRoles.length > 0 && currentUser) {
    const hasRequiredRole = allowedRoles.includes(currentUser.role);
    if (!hasRequiredRole) {
      // Redirect to dashboard if user doesn't have the required role
      return <Navigate to="/" replace />;
    }
  }

  // Return children or outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

// Check if a route is an auth route (login, register, verify-email)
const isAuthRoute = (path: string): boolean => {
  return ['/login', '/register', '/verify-email'].some(authPath =>
    path === authPath || path.startsWith(`${authPath}/`)
  );
};

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Helper function to create route elements
  const createRouteElement = (route: RouteConfig) => (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <route.element />
      </Suspense>
    </ErrorBoundary>
  );

  // Filter routes into auth routes and main routes
  const authRoutes = routes.filter(route => isAuthRoute(route.path));
  const mainRoutes = routes.filter(route => !isAuthRoute(route.path));
  
  // Separate protected and public routes
  const protectedRoutes = mainRoutes.filter(route => route.requiresAuth);
  const publicRoutes = mainRoutes.filter(route => !route.requiresAuth);

  return (
    <Routes>
      {/* Auth routes without MainLayout */}
      {authRoutes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={createRouteElement(route)}
          errorElement={<RouteErrorBoundary />}
        />
      ))}

      {/* Main Layout wrapper */}
      <Route
        element={
          <ErrorBoundary>
            <MainLayout />
          </ErrorBoundary>
        }
        errorElement={<RouteErrorBoundary />}
      >
        {/* Public routes within MainLayout */}
        {publicRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={createRouteElement(route)}
            errorElement={<RouteErrorBoundary />}
          />
        ))}

        {/* Protected routes within MainLayout */}
        {protectedRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={route.allowedRoles}>
                {createRouteElement(route)}
              </ProtectedRoute>
            }
            errorElement={<RouteErrorBoundary />}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;