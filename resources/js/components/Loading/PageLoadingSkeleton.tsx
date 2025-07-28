import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface PageLoadingSkeletonProps {
    showHeader?: boolean;
    showStats?: boolean;
    showFilters?: boolean;
    showTable?: boolean;
    className?: string;
}

export const PageLoadingSkeleton: React.FC<PageLoadingSkeletonProps> = ({
    showHeader = true,
    showStats = true,
    showFilters = true,
    showTable = true,
    className = ''
}) => (
    <div className={`animate-pulse ${className}`}>
        {showHeader && (
            <div className="mb-8">
                <LoadingSkeleton height="h-8" className="w-1/3 mb-2" />
                <LoadingSkeleton height="h-4" className="w-1/2 mb-6" />
            </div>
        )}
        
        {showStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                        <LoadingSkeleton height="h-6" className="w-16 mb-2" />
                        <LoadingSkeleton height="h-4" className="w-2/3" />
                    </div>
                ))}
            </div>
        )}
        
        {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <LoadingSkeleton height="h-12" className="flex-1" />
                    <LoadingSkeleton height="h-12" className="w-full lg:w-64" />
                    <LoadingSkeleton height="h-12" className="w-full lg:w-32" />
                </div>
            </div>
        )}
        
        {showTable && (
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="grid grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <LoadingSkeleton key={i} height="h-4" className="w-full" />
                        ))}
                    </div>
                </div>
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border-b border-gray-200 px-6 py-4">
                        <div className="grid grid-cols-6 gap-4 items-center">
                            <div className="flex items-center gap-3">
                                <LoadingSkeleton height="h-10" className="w-10 rounded-full" />
                                <div className="flex-1">
                                    <LoadingSkeleton height="h-4" className="w-full mb-1" />
                                    <LoadingSkeleton height="h-3" className="w-2/3" />
                                </div>
                            </div>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <LoadingSkeleton key={i} height="h-4" className="w-full" />
                            ))}
                            <LoadingSkeleton height="h-8" className="w-16" />
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);