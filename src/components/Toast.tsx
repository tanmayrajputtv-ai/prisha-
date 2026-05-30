import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-amber-50 text-amber-800 border-amber-200',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertTriangle,
    info: Info,
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-xl border shadow-lg max-w-sm w-full animate-fade-in ${bgClass}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mr-3" />
      <p className="text-sm font-medium mr-2 flex-grow">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
