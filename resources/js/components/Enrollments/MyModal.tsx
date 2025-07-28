// components/MyModal.tsx
import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react'; // Assuming you use lucide-react in MyModal

interface LearnerData {
    learner_id: number;
    first_name: string;
    last_name: string;
    course_qualification: string;
    // Add other relevant fields if you want to display them
}

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
  actionType: 'accept' | 'reject' | null;
  selectedLearner: LearnerData | null; // Added this prop
}

export const MyModal: React.FC<MyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  actionType,
  selectedLearner, // Use the prop
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null); // To store the element that opened the modal

  // Effect to manage focus when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store the element that currently has focus, so we can return to it later
      triggerElementRef.current = document.activeElement as HTMLElement;
      // Focus the modal content when it opens
      modalContentRef.current?.focus();

      // Temporarily hide main app content from assistive technologies
      // You might need to adjust '#app' selector based on your actual root div ID
      const appRoot = document.getElementById('app');
      if (appRoot) {
        appRoot.setAttribute('aria-hidden', 'true');
      }
    } else {
      // Restore focus to the element that opened the modal
      triggerElementRef.current?.focus();

      // Remove aria-hidden from main app content
      const appRoot = document.getElementById('app');
      if (appRoot) {
        appRoot.removeAttribute('aria-hidden');
      }
    }

    // Cleanup on unmount or isOpen change
    return () => {
      // Ensure aria-hidden is removed if component unmounts while still open
      const appRoot = document.getElementById('app');
      if (appRoot) {
        appRoot.removeAttribute('aria-hidden');
      }
    };
  }, [isOpen]);

  // Handle ESC key to close modal (basic trap)
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) { // Don't close with Esc if loading
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  // If modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Clicking overlay closes modal
    >
      <div
        ref={modalContentRef} // Attach ref for focus
        role="dialog" // Important for accessibility
        aria-modal="true" // Important for accessibility
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto border overflow-hidden
                   // You might want to add entrance/exit animations here if you like
                   // e.g., animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
                   // Note: Custom animations need proper CSS keyframes.
                  "
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
        tabIndex={-1} // Make div focusable so it can receive programmatic focus
      >
        <div className={`h-2 ${actionType === 'accept' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${actionType === 'accept' ? 'bg-green-100' : 'bg-red-100'}`}>
              {actionType === 'accept' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">{title}</h2>
              <p id="modal-description" className="text-gray-500 text-sm">{message}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-dark font-semibold text-sm">
                    {selectedLearner?.first_name?.charAt(0)}{selectedLearner?.last_name?.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-gray-900">
                        {selectedLearner?.first_name} {selectedLearner?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                        {selectedLearner?.course_qualification}
                    </p>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-lg text-dark font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
              ${actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              actionType === 'accept' ? 'Accept' : 'Reject'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};