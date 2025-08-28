import toast from 'react-hot-toast';

/**
 * Centralized error handling utility for consistent toast notifications
 * Replace setError calls with showError to display errors as toast notifications
 */

export const showError = (error: unknown, fallbackMessage = "An unexpected error occurred") => {
  const errorMessage = error instanceof Error ? error.message : 
                      typeof error === 'string' ? error : 
                      fallbackMessage;
  
  toast.error(errorMessage, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#FEF2F2',
      border: '1px solid #FCA5A5',
      color: '#DC2626',
    },
    iconTheme: {
      primary: '#DC2626',
      secondary: '#FEF2F2',
    },
  });
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#F0FDF4',
      border: '1px solid #86EFAC',
      color: '#16A34A',
    },
    iconTheme: {
      primary: '#16A34A',
      secondary: '#F0FDF4',
    },
  });
};

export const showWarning = (message: string) => {
  toast(message, {
    icon: '⚠️',
    duration: 3500,
    position: 'top-right',
    style: {
      background: '#FFFBEB',
      border: '1px solid #FCD34D',
      color: '#D97706',
    },
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#EFF6FF',
      border: '1px solid #93C5FD',
      color: '#1D4ED8',
    },
  });
};
