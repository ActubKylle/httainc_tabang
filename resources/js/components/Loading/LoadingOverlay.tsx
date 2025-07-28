import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
    isLoading: boolean;
    children: React.ReactNode;
    message?: string;
    transparent?: boolean;
    className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
    isLoading, 
    children,
    message = 'Loading...',
    transparent = false,
    className = ''
}) => (
    <div className={`relative ${className}`}>
        {children}
        {isLoading && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 rounded-lg ${
                transparent ? 'bg-white/30 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
            }`}>
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-lg border">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-gray-600">{message}</span>
                </div>
            </div>
        )}
    </div>
);