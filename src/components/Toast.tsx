import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'offline' | 'online';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    messageColor: 'text-yellow-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700'
  },
  offline: {
    icon: WifiOff,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-600',
    titleColor: 'text-gray-800',
    messageColor: 'text-gray-700'
  },
  online: {
    icon: Wifi,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700'
  }
};

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  action,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);

      if (remaining <= 0) {
        setIsVisible(false);
        setTimeout(() => onClose(id), 200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 200);
  };

  return (
    <div
      className={`
        toast-enter
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        transition-all duration-200 ease-out
        max-w-sm w-full ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg pointer-events-auto
        ring-1 ring-black ring-opacity-5 overflow-hidden
      `}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </p>
            {message && (
              <p className={`mt-1 text-sm ${config.messageColor}`}>
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`
                    text-sm font-medium ${config.iconColor} hover:${config.titleColor}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                    transition-colors duration-200
                  `}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className={`
                inline-flex ${config.messageColor} hover:${config.titleColor}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                transition-colors duration-200 rounded-md p-1
              `}
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {duration > 0 && (
        <div className="h-1 bg-gray-200">
          <div
            className={`h-full transition-all duration-50 ease-linear ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

export default Toast;