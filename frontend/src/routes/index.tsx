import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { routes, RouteConfig } from './RouteConfig';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
        <Suspense fallback={<LoadingSpinner />}>
          <route.element />
        </Suspense>
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
        >
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {renderRoutes(routes)}
      </Route>
    </Routes>
  );
};

export default AppRoutes;