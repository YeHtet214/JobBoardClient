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
  const { login } = useAuth();
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

  return (
    <AuthLayout 
      title="Welcome to Job Board" 
      subtitle="Find your dream job or the perfect candidate"
      imageSrc="/auth-background-alt.svg"
      imageAlt="Job Board Authentication"
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
