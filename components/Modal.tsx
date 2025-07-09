
import React, { useEffect } from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-out animate-fade-in-down"
      onClick={onClose} // Close on overlay click
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-slate-800 rounded-xl shadow-2xl flex flex-col ring-1 ring-slate-700 w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 id="modal-title" className="text-lg font-semibold text-sky-400">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-sky-300 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Đóng modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-grow">
          {children}
        </div>

        {/* Footer (optional, can add props for footer content if needed) */}
        {/* <div className="p-4 border-t border-slate-700 sticky bottom-0 bg-slate-800 z-10">
          <button onClick={onClose} className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-500">Đóng</button>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;
