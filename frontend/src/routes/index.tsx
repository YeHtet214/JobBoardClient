import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { routes, RouteConfig } from './RouteConfig';
import MainLayout from '../components/layouts/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import RouteErrorBoundary from '../components/RouteErrorBoundary';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = false; // TODO: Replace with useAuth() hook
  
  if (!isAuthenticated) { // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Return children or outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
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

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ErrorBoundary>
            <MainLayout />
          </ErrorBoundary>
        }
        errorElement={<RouteErrorBoundary />}
      >
        {renderRoutes(routes)}
      </Route>
    </Routes>
  );
};

export default AppRoutes;