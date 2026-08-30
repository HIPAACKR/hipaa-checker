'use client';

export const ModalFooter = ({ children, className = '' }) => {
  return (
    <div className={`flex gap-3 p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};