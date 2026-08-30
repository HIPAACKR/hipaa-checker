'use client';

import { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  // If size is a key in sizeClasses, use the class. Otherwise, treat as custom width.
  const isCustomWidth = typeof size === 'string' && !(size in sizeClasses);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-white rounded-lg shadow-xl ${!isCustomWidth ? sizeClasses[size] : ''} w-full mx-4 max-h-[90vh] overflow-y-auto`}
        style={isCustomWidth ? { maxWidth: size + 'px' } : {}}
      >
        {children}
      </div>
    </div>
  );
};