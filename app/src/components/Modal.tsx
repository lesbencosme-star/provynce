import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-stellar-navy via-blue-950/95 to-stellar-navy-dark border border-white/20 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        {(title || description) && (
          <div className="px-6 py-5 border-b border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
                {description && <p className="text-sm text-gray-400 mt-2">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-white/10 bg-black/30">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
