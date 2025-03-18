import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types/auth.types';
import * as Yup from 'yup';
import { Formik, FormikHelpers, Field, ErrorMessage } from 'formik';
import { Form } from '../components/forms/components';
import AuthLayout from '../components/layouts/AuthLayout';

// Shadcn UI components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Select } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { AlertCircle } from "lucide-react";

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
        .oneOf(['JOBSEEKER', 'EMPLOYER'], 'Please select a valid role')
        .required('Please select your role')
});

const RegisterPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'JOBSEEKER' as UserRole,
        terms: false
    };

    const handleSubmit = async (
        values: typeof initialValues, 
        { setSubmitting }: FormikHelpers<typeof initialValues>
    ) => {
        setError(null);
        
        try {
            // Remove confirmPassword as it's not part of the RegisterRequest type
            const { confirmPassword, terms, ...registerData } = values;
            await register(registerData);
            navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration');
        } finally {
            setSubmitting(false);
        }
    };

    const roleOptions = [
        { value: 'JOBSEEKER', label: 'Job Seeker' },
        { value: 'EMPLOYER', label: 'Employer' }
    ];

    return (
        <AuthLayout 
            title="Join Our Job Board" 
            subtitle="Connect with employers and find your perfect career match"
            imageSrc="/auth-background.svg"
            imageAlt="Job Board Registration"
            imagePosition="left"
        >
            <Card className="border-border/40 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-destructive/15 text-destructive flex items-center p-3 rounded-md text-sm" role="alert">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <Formik
                        initialValues={initialValues}
                        validationSchema={registerSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, touched, errors }) => (
                            <Form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Field
                                            as={Input}
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="John"
                                            autoComplete="given-name"
                                            className={touched.firstName && errors.firstName ? "border-destructive" : ""}
                                        />
                                        <ErrorMessage name="firstName" component="div" className="text-sm text-destructive" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Field
                                            as={Input}
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            autoComplete="family-name"
                                            className={touched.lastName && errors.lastName ? "border-destructive" : ""}
                                        />
                                        <ErrorMessage name="lastName" component="div" className="text-sm text-destructive" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Field
                                        as={Input}
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        className={touched.email && errors.email ? "border-destructive" : ""}
                                    />
                                    <ErrorMessage name="email" component="div" className="text-sm text-destructive" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Field
                                        as={Input}
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        className={touched.password && errors.password ? "border-destructive" : ""}
                                    />
                                    <ErrorMessage name="password" component="div" className="text-sm text-destructive" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Field
                                        as={Input}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        className={touched.confirmPassword && errors.confirmPassword ? "border-destructive" : ""}
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-sm text-destructive" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">I am a</Label>
                                    <Field
                                        as={Select}
                                        id="role"
                                        name="role"
                                        className={touched.role && errors.role ? "border-destructive" : ""}
                                    >
                                        {roleOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="text-sm text-destructive" />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Field
                                        as={Checkbox}
                                        id="terms"
                                        name="terms"
                                    />
                                    <Label htmlFor="terms" className="text-sm font-normal">
                                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                    </Label>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating account..." : "Create Account"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
                
                <CardFooter className="flex justify-center border-t p-4">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
};

export default RegisterPage;