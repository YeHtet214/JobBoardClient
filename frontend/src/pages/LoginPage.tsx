import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { LoginRequest } from '../types/auth.types';
import * as Yup from 'yup';
import { Formik, FormikHelpers, Field, ErrorMessage } from 'formik';
import { Form } from '../components/forms/components';
import AuthLayout from '../components/layouts/AuthLayout';

// Shadcn UI components with correct import paths
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { AlertCircle } from "lucide-react";
import { Separator } from "../components/ui/separator";

// Login validation schema
const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const LoginPage: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const initialValues: LoginRequest = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: LoginRequest, { setSubmitting }: FormikHelpers<LoginRequest>) => {
    setError(null);
    
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
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

  return (
    <AuthLayout 
      title="Welcome to Job Board" 
      subtitle="Find your dream job or the perfect candidate"
      imageSrc="/auth-background-alt.svg"
      imagePosition="right"
    >
      <Card className="border-border/40 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your credentials to sign in to your account
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
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={touched.password && errors.password ? "border-destructive" : ""}
                  />
                  <ErrorMessage name="password" component="div" className="text-sm text-destructive" />
                </div>

                <div className="flex items-center space-x-2">
                  <Field
                    as={Checkbox}
                    id="remember"
                    name="remember"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
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
            Sign in with Google
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
