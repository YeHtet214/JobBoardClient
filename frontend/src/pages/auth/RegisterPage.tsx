import React, { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '@/types/auth.types';
import * as Yup from 'yup';
import { Formik, FormikHelpers, Field, ErrorMessage, FieldProps, FormikProps } from 'formik';
import { Form } from '@/components/forms/components';
import AuthLayout from '@/components/layouts/AuthLayout';

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const [agreeTerms, setAgreeTerms] = useState(false);

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
            navigate('/verify-email', { 
                state: { 
                    email: values.email,
                    message: 'Registration successful! Please verify your email to complete your registration.'
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        try {
            await googleLogin();
            // The page will be redirected to Google's OAuth page
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during Google login');
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
                                            disabled={isSubmitting}
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
                                            disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-sm text-destructive" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">I am a</Label>
                                    <Field name="role" disabled={isSubmitting}>
                                        {({ field, form }: { 
                                            field: FieldProps<string>['field'], 
                                            form: FormikProps<typeof initialValues>
                                        }) => (
                                            <Select
                                                defaultValue={field.value}
                                                onValueChange={(value) => form.setFieldValue('role', value)}
                                            >
                                                <SelectTrigger 
                                                    id="role"
                                                    className={touched.role && errors.role ? "border-destructive" : "w-full"}
                                                >
                                                    <SelectValue placeholder="Select your role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roleOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="text-sm text-destructive" />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Field
                                        as={Checkbox}
                                        id="terms"
                                        name="terms"
                                        disabled={isSubmitting}
                                        value={agreeTerms.toString()}
                                        onClick={() => { setAgreeTerms(!agreeTerms); console.log(agreeTerms)}}
                                    />
                                    <Label htmlFor="terms" className="text-sm font-normal">
                                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                    </Label>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={isSubmitting || !agreeTerms}
                                >
                                    {isSubmitting ? "Creating account..." : "Create Account"}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    {/* Google OAuth Button */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleLogin}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign up with Google
                    </Button>
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