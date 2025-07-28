// --- components/Enrollments/MyImagePreviewModal.tsx (New Component) ---
import React from 'react';
import { X } from 'lucide-react';

interface MyImagePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    altText: string;
}

export const MyImagePreviewModal: React.FC<MyImagePreviewModalProps> = ({ isOpen, onClose, imageUrl, altText }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black bg-opacity-75 flex items-center justify-center p-4"
            onClick={onClose} // Close when clicking outside
        >
            <div
                className="relative bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors z-10"
                    aria-label="Close image preview"
                >
                    <X className="w-6 h-6" />
                </button>
                <img
                    src={imageUrl}
                    alt={altText}
                    className="max-w-full max-h-[85vh] object-contain mx-auto"
                    style={{ maxHeight: 'calc(100vh - 80px)' }} // Adjust for padding/button
                />
            </div>
        </div>
    );
};