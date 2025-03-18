import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useParams, useNavigate, Link } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
    const { verifyEmail } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string>('');
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const sendVerifyRequest = async () => {
            try {
                if (!token) {
                    setStatus('error');
                    setMessage('Verification token is missing. Please check your email link.');
                    return;
                }

                const response = await verifyEmail(token);
                setStatus('success');
                setMessage(response?.message || 'Your email has been successfully verified!');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'Failed to verify your email. Please try again.');
            }
        };

        sendVerifyRequest();
    }, []);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        <p className="text-gray-700">Verifying your email address...</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex flex-col items-center gap-6">
                        <div className="rounded-full bg-green-100 p-3">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-16 w-16 text-green-600" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-green-600">Email Verified!</h2>
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md w-full">
                            {message}
                        </div>
                        <div className="flex gap-4 mt-2">
                            <button 
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Go to Login
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex flex-col items-center gap-6">
                        <div className="rounded-full bg-red-100 p-3">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-16 w-16 text-red-600" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-red-600">Verification Failed</h2>
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md w-full">
                            {message}
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            If you're having trouble, please contact our support team or try again later.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <button 
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Email Verification</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default VerifyEmailPage;