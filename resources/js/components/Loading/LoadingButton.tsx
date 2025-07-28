// components/Loading/LoadingButton.tsx
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    loadingText?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading,
    loadingText = 'Loading...',
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border border-gray-300'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm gap-2',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-3'
    };

    const spinnerSize = size === 'sm' ? 'xs' : size === 'lg' ? 'sm' : 'xs';
    const spinnerColor = variant === 'ghost' ? 'primary' : 'white';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <LoadingSpinner size={spinnerSize} color={spinnerColor} />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
};
