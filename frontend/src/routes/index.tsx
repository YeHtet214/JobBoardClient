import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { routes, RouteConfig } from './RouteConfig';
import MainLayout from '../components/layouts/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) { // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
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
  // Helper function to render routes recursively
  const renderRoutes = (routes: RouteConfig[]) => {
    return routes.map((route) => {
      // Create the element with proper authentication wrapper if needed
      const element = (
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <route.element />
          </Suspense>
        </ErrorBoundary>
      );

      // Return protected or regular route
      return (
        <Route
          key={route.path}
          path={route.path}
          element={route.requiresAuth ? (
            <ProtectedRoute>
              {element}
            </ProtectedRoute>
          ) : element}
          errorElement={<RouteErrorBoundary />}
        >
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  // Filter routes into auth routes and main routes
  const authRoutes = routes.filter(route => isAuthRoute(route.path));
  const mainRoutes = routes.filter(route => !isAuthRoute(route.path));

  return (
    <Routes>
      {/* Auth routes without MainLayout */}
      {renderRoutes(authRoutes)}

      {/* Main routes with MainLayout */}
      <Route 
        path="/" 
        element={
          <ErrorBoundary>
            <MainLayout />
          </ErrorBoundary>
        }
        errorElement={<RouteErrorBoundary />}
      >
        {renderRoutes(mainRoutes)}
      </Route>
    </Routes>
  );
};

export default AppRoutes;