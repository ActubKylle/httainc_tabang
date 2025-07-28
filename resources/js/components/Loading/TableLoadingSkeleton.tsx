import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface TableLoadingSkeletonProps {
    rows?: number;
    columns?: number;
    showAvatar?: boolean;
    className?: string;
}

export const TableLoadingSkeleton: React.FC<TableLoadingSkeletonProps> = ({
    rows = 5,
    columns = 4,
    showAvatar = true,
    className = ''
}) => (
    <div className={`animate-pulse ${className}`}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="border-b border-gray-200 py-4 px-6">
                <div className="flex items-center space-x-4">
                    {showAvatar && (
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-gray-300 rounded-full" />
                        </div>
                    )}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={colIndex}>
                                <LoadingSkeleton 
                                    height={colIndex === 0 ? 'h-4' : 'h-3'} 
                                    className={colIndex === 0 ? 'w-3/4' : 'w-full'} 
                                />
                                {colIndex === 0 && (
                                    <LoadingSkeleton height="h-3" className="w-1/2 mt-1" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex-shrink-0">
                        <LoadingSkeleton height="h-8" className="w-16" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);