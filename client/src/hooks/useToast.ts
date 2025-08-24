import { useState, useCallback } from 'react';
import type { ToastProps } from '../components/common/Toast';

export interface UseToastReturn {
  toasts: ToastProps[];
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration || 5000;

    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: () => {},
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
  };
};

export default useToast;
