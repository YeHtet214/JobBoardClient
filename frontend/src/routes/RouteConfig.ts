import ApplicationDetailPage from '@/pages/jobseeker/ApplicationDetailPage';
import JobDetailPage from '@/pages/employer/JobDetailPage';
import React, { lazy } from 'react';

import OAuthCallbackPage from '@/pages/OAuthCallbackPage';

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
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmailPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ApplicationsPage = lazy(() => import('@/pages/jobseeker/ApplicationsPage'))
const ProfilePage = lazy(() => import('@/pages/jobseeker/ProfilePage'));
const JobsPage = lazy(() => import('@/pages/employer/JobsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CompanyProfilePage = lazy(() => import('@/pages/employer/CompanyProfilePage'));
const CompaniesPage = lazy(() => import('@/pages/CompaniesPage'));
const CompanyDetailPage = lazy(() => import('@/pages/CompanyDetailPage'));

// Employer pages
const CreateJobPage = lazy(() => import('@/pages/employer/CreateJobPage'));
const EditJobPage = lazy(() => import('@/pages/employer/EditJobPage'));
const EmployerJobsPage = lazy(() => import('@/pages/employer/EmployerJobsPage'));
const CompanyProfileEditPage = lazy(() => import('@/pages/employer/CompanyProfileEditPage'));

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
    path: '/oauth/callback',
    element: OAuthCallbackPage,
    meta: { title: 'Google Callback' }
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
    path: '/companies',
    element: CompaniesPage,
    meta: { title: 'Companies', description: 'Browse companies and explore job opportunities' }
  },
  {
    path: '/companies/:id',
    element: CompanyDetailPage,
    meta: { title: 'Company Details', description: 'View company profile and job openings' }
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
    path: '/company/profile',
    element: CompanyProfilePage,
    requiresAuth: true,
    allowedRoles: ['EMPLOYER'],
    meta: { title: 'Company Profile', description: 'Manage your company profile' }
  },
  {
    path: '/employer/company/edit',
    element: CompanyProfileEditPage,
    requiresAuth: true,
    allowedRoles: ['EMPLOYER'],
    meta: { title: 'Edit Company Profile', description: 'Edit your company profile' }
  },
  {
    path: '/employer/jobs',
    element: EmployerJobsPage,
    requiresAuth: true,
    allowedRoles: ['EMPLOYER'],
    meta: { title: 'Manage Jobs', description: 'View and manage your job postings' }
  },
  {
    path: '/employer/jobs/create',
    element: CreateJobPage,
    requiresAuth: true,
    allowedRoles: ['EMPLOYER'],
    meta: { title: 'Post Job', description: 'Create a new job posting' }
  },
  {
    path: '/employer/jobs/edit/:id',
    element: EditJobPage,
    requiresAuth: true,
    allowedRoles: ['EMPLOYER'],
    meta: { title: 'Edit Job', description: 'Edit an existing job posting' }
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