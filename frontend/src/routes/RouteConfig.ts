import ApplicationDetailPage from '@/pages/ApplicationDetailPage';
import JobDetailPage from '@/pages/JobDetailPage';
import React, { lazy } from 'react';

// Define route types
export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
  children?: RouteConfig[];
  requiresAuth?: boolean;
  allowedRoles?: string[];
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
const ApplicationsPage = lazy(() => import('../pages/ApplicationsPage'))
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
    meta: { title: 'Login', description: 'Login to your account' }
  },
  {
    path: '/register',
    element: RegisterPage,
    meta: { title: 'Register', description: 'Create a new account' }
  },
  {
    path: '/verify-email/:token',
    element: VerifyEmailPage,
    meta: { title: 'Email Verification', description: 'Verify your email to continue your account registration.' }
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
    path: '/jobs/:id',
    element: JobDetailPage,
    meta: { title: 'Job Details' }
  },
  {
    path: '/dashboard',
    element: DashboardPage,
    requiresAuth: true,
    allowedRoles: ['JOBSEEKER', 'EMPLOYER', 'ADMIN'],
    meta: { title: 'Dashboard', description: 'Your personal dashboard' }
  },
  {
    path: '/profile',
    element: ProfilePage,
    requiresAuth: true,
    allowedRoles: ['JOBSEEKER', 'EMPLOYER', 'ADMIN'],
    meta: { title: 'Profile', description: 'Manage your profile' }
  },
  {
    path: '/applications',
    element: ApplicationsPage,
    requiresAuth: true,
    allowedRoles: ['JOBSEEKER'],
    meta: { title: 'My Applications', description: 'View and manage your job applications' }
  },
  {
    path: '/applications/:id',
    element: ApplicationDetailPage,
    requiresAuth: true,
    allowedRoles: ['JOBSEEKER'],
    meta: { title: 'Application Details', description: 'View details of your job application' }
  },
  {
    path: '/saved-jobs',
    element: JobsPage,
    requiresAuth: true,
    allowedRoles: ['JOBSEEKER'],
    meta: { title: 'Saved Jobs', description: 'View your saved jobs' }
  },
  {
    path: '*',
    element: NotFoundPage,
    meta: { title: 'Page Not Found' }
  }
];