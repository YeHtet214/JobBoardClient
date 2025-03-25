import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    const spinnerSize = sizeClasses[size];

    return (
        <div className={`inline-flex ${className}`}>
            <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-jobboard-purple`}></div>
        </div>
    );
};

export default LoadingSpinner;