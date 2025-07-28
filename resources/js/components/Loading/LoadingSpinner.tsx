// components/Loading/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'white';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'md', 
    color = 'primary',
    className = '' 
}) => {
    const sizeClasses = {
        xs: 'w-3 h-3 border',
        sm: 'w-4 h-4 border',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-2',
        xl: 'w-12 h-12 border-4'
    };

    const colorClasses = {
        primary: 'border-gray-300 border-t-blue-600',
        secondary: 'border-gray-300 border-t-gray-600',
        success: 'border-gray-300 border-t-green-600',
        danger: 'border-gray-300 border-t-red-600',
        warning: 'border-gray-300 border-t-yellow-600',
        white: 'border-gray-400 border-t-white'
    };

    return (
        <div 
            className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};
