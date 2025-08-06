// resources/js/Components/SkeletonLoader.tsx
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6 p-8 border border-gray-200 rounded-xl bg-white shadow-inner">
      {/* Simulate form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
      {/* Simulate checkboxes/radio buttons */}
      <div className="space-y-4 mt-8">
        <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-6 w-5/6 bg-gray-300 rounded"></div>
      </div>
      {/* Simulate buttons */}
      <div className="flex justify-between mt-8">
        <div className="h-12 w-32 bg-gray-300 rounded-full"></div>
        <div className="h-12 w-32 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;