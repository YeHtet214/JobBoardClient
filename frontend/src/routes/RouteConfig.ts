import React, { lazy } from 'react';

// Define route types
export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
  children?: RouteConfig[];
  requiresAuth?: boolean;
  meta?: {
    title?: string;
    description?: string;
  };
}

// Lazy load page components
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const VerifyEmailPage = lazy(() => import('../pages/VerifyEmailPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ApplicationPage = lazy(() => import('../pages/ApplicationPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage')); 
const JobsPage = lazy(() => import('../pages/JobsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Define routes
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: HomePage,
    meta: { title: 'Home', description: 'Welcome to our app' }
  },
  {
    path: '/login',
    element: LoginPage,
    meta: { title: 'Home', description: 'Welcome to our app' }
  },
  {
    path: '/register',
    element: RegisterPage,
    meta: { title: 'Home', description: 'Welcome to our app' }
  },
  {
    path: '/verify-email/:token',
    element: VerifyEmailPage,
    meta: { title: 'Email Verification', description: 'Verify your email to continue your account registration.'}
  },
  {
    path: '/application',
    element: ApplicationPage,
    meta: { title: 'Application', description: 'Apply for a job' }
  },
  {
    path: '/about',
    element: AboutPage,
    meta: { title: 'About Us' }
  },
  {
    path: '/jobs',
    element: JobsPage,
    meta: { title: 'Jobs' }
  },
  {
    path: '/dashboard',
    element: DashboardPage,
    requiresAuth: true,
    meta: { title: 'Dashboard' },
    children: [
      {
        path: 'profile',
        element: ProfilePage,
        requiresAuth: true,
        meta: { title: 'User Profile' }
      }
    ]
  },
  {
    path: '*',
    element: NotFoundPage,
    meta: { title: 'Page Not Found' }
  }
];