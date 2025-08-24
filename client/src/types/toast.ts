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
