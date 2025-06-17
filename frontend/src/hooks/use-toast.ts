import { useState } from 'react';

interface Toast {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (toastData: Toast) => {
    setToast(toastData);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return {
    toast,
    showToast,
  };
}; 