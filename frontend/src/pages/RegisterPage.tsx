import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterRequest, UserRole } from '../types/auth.types';
import * as Yup from 'yup';
import { useFormik, FormikHelpers } from 'formik';

// Password regex pattern
// At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .matches(
            passwordRegex,
            'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    role: Yup.string()
        .oneOf(['JOB_SEEKER', 'EMPLOYER'], 'Please select a valid role')
        .required('Please select your role')
});

const RegisterPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik<RegisterRequest & { confirmPassword: string }>({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            role: 'JOB_SEEKER' as UserRole
        },
        validationSchema: registerSchema,
        onSubmit: async (values, { setSubmitting }: FormikHelpers<RegisterRequest & { confirmPassword: string }>) => {
            setError(null);
            
            try {
                // Remove confirmPassword as it's not part of the RegisterRequest type
                const { confirmPassword, ...registerData } = values;
                await register(registerData);
                navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred during registration');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="w-full max-w-lg m-auto bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create Your Account</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
                        <div className="flex-1">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    formik.touched.firstName && formik.errors.firstName 
                                        ? 'border-red-500' 
                                        : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    formik.touched.lastName && formik.errors.lastName 
                                        ? 'border-red-500' 
                                        : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                formik.touched.email && formik.errors.email 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                formik.touched.password && formik.errors.password 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                formik.touched.confirmPassword && formik.errors.confirmPassword 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            I am a
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                formik.touched.role && formik.errors.role 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        >
                            <option value="JOB_SEEKER">Job Seeker</option>
                            <option value="EMPLOYER">Employer</option>
                        </select>
                        {formik.touched.role && formik.errors.role && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.role}</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;