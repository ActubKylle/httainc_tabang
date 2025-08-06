// components/MyModal.tsx - Enhanced version
import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface LearnerData {
    learner_id: number;
    first_name: string;
    last_name: string;
    course_qualification?: string;
    program_name?: string; // Add this as it's used in your main component
    email?: string;
}

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
  actionType: 'accept' | 'reject' | null;
  selectedLearner: LearnerData | null;
}

export const MyModal: React.FC<MyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  actionType,
  selectedLearner,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Effect to manage focus when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      modalContentRef.current?.focus();

      const appRoot = document.getElementById('app');
      if (appRoot) {
        appRoot.setAttribute('aria-hidden', 'true');
      }
    } else {
      triggerElementRef.current?.focus();

      const appRoot = document.getElementById('app');
      if (appRoot) {
        appRoot.removeAttribute('aria-hidden');
      }
    }

    return () => {
      const appRoot = document.getElementById('app');
      if (appRoot) {
        appRoot.removeAttribute('aria-hidden');
      }
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  // Enhanced loading text based on action type
  const getLoadingText = () => {
    if (actionType === 'accept') return 'Accepting enrollment...';
    if (actionType === 'reject') return 'Rejecting enrollment...';
    return 'Processing...';
  };

  const getConfirmButtonText = () => {
    if (actionType === 'accept') return 'Accept Enrollment';
    if (actionType === 'reject') return 'Reject Enrollment';
    return 'Confirm';
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={!isLoading ? onClose : undefined} // Prevent closing while loading
    >
      <div
        ref={modalContentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto border overflow-hidden transform transition-all duration-200 ease-out ${
          isLoading ? 'scale-[0.98] opacity-95' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Colored header bar with subtle animation */}
        <div className={`h-2 transition-all duration-300 ${
          isLoading 
            ? (actionType === 'accept' ? 'bg-gradient-to-r from-green-300 to-emerald-400' : 'bg-gradient-to-r from-red-300 to-rose-400')
            : (actionType === 'accept' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500')
        }`} />

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isLoading 
                ? (actionType === 'accept' ? 'bg-green-50' : 'bg-red-50')
                : (actionType === 'accept' ? 'bg-green-100' : 'bg-red-100')
            }`}>
              {actionType === 'accept' ? (
                <CheckCircle className={`w-6 h-6 transition-colors duration-200 ${
                  isLoading ? 'text-green-400' : 'text-green-600'
                }`} />
              ) : (
                <XCircle className={`w-6 h-6 transition-colors duration-200 ${
                  isLoading ? 'text-red-400' : 'text-red-600'
                }`} />
              )}
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">{title}</h2>
              <p id="modal-description" className={`text-sm transition-colors duration-200 ${
                isLoading ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {isLoading ? getLoadingText() : message}
              </p>
            </div>
          </div>

          {/* Learner info card with loading state */}
          <div className={`rounded-lg p-4 mb-6 border transition-all duration-200 ${
            isLoading 
              ? 'bg-gray-25 border-gray-100' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all duration-200 ${
                isLoading ? 'opacity-70' : 'opacity-100'
              }`}>
                {selectedLearner?.first_name?.charAt(0)}{selectedLearner?.last_name?.charAt(0)}
              </div>
              <div className={`transition-all duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
                <p className="font-semibold text-gray-900">
                  {selectedLearner?.first_name} {selectedLearner?.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedLearner?.program_name || selectedLearner?.course_qualification || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Loading progress indicator */}
          {isLoading && (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
                <span>Please wait...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer with enhanced button states */}
        <div className={`border-t px-6 py-4 flex justify-end gap-3 transition-all duration-200 ${
          isLoading ? 'bg-gray-25 border-gray-100' : 'bg-gray-50 border-gray-200'
        }`}>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-5 py-2.5 border rounded-lg font-semibold transition-all duration-200 ${
              isLoading 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px] ${
              isLoading 
                ? 'opacity-75 cursor-not-allowed'
                : (actionType === 'accept' ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg' : 'bg-red-600 hover:bg-red-700 hover:shadow-lg')
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <span>{getConfirmButtonText()}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};