// components/Loading/LoadingSkeleton.tsx
import React from 'react';

interface LoadingSkeletonProps {
    className?: string;
    rows?: number;
    height?: string;
    rounded?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    className = '',
    rows = 1,
    height = 'h-4',
    rounded = true
}) => (
    <div className={`animate-pulse ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
            <div
                key={index}
                className={`bg-gray-300 ${height} ${rounded ? 'rounded' : ''} ${
                    index < rows - 1 ? 'mb-2' : ''
                }`}
            />
        ))}
    </div>
);