import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer, { ToastMessage, ToastType } from '@/components/Toast';

interface ToastContextType {
  showToast: (message: string | React.ReactNode, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string | React.ReactNode, duration?: number) => void;
  showError: (message: string | React.ReactNode, duration?: number) => void;
  showInfo: (message: string | React.ReactNode, duration?: number) => void;
  showWarning: (message: string | React.ReactNode, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string | React.ReactNode, type: ToastType = 'info', duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback((message: string | React.ReactNode, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message: string | React.ReactNode, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showInfo = useCallback((message: string | React.ReactNode, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const showWarning = useCallback((message: string | React.ReactNode, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={handleClose} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
