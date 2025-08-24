import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  onClose,
}) => {
  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colorMap = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
    },
  };

  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        ${colors.bg} ${colors.border} ${colors.text}
        border rounded-lg shadow-lg p-4 max-w-sm w-full
        backdrop-blur-sm
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-medium text-sm mb-1">{title}</p>
          )}
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className={`flex-shrink-0 ${colors.text} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
