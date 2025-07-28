import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface CardLoadingSkeletonProps {
    cards?: number;
    showImage?: boolean;
    className?: string;
}

export const CardLoadingSkeleton: React.FC<CardLoadingSkeletonProps> = ({
    cards = 3,
    showImage = false,
    className = ''
}) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: cards }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                {showImage && (
                    <LoadingSkeleton height="h-48" className="mb-4" />
                )}
                <LoadingSkeleton height="h-6" className="w-3/4 mb-2" />
                <LoadingSkeleton height="h-4" className="w-full mb-2" />
                <LoadingSkeleton height="h-4" className="w-2/3 mb-4" />
                <div className="flex justify-between items-center">
                    <LoadingSkeleton height="h-8" className="w-20" />
                    <LoadingSkeleton height="h-8" className="w-16" />
                </div>
            </div>
        ))}
    </div>
);