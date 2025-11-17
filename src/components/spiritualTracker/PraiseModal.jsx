import React, { useEffect } from 'react';

const PraiseModal = ({ isVisible, closeModal, textContent }) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        closeModal();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, closeModal]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Praise Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {/* Praise Message */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Great Job!
        </h3>

        <p className="text-gray-600 text-lg leading-relaxed">
          {textContent || "You've completed another spiritual task! Keep up the great work!"}
        </p>

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PraiseModal;