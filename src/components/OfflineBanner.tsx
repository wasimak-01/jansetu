import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Upload, Clock } from 'lucide-react';

interface OfflineBannerProps {
  queuedItems?: number;
  onRetrySync?: () => void;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ queuedItems = 0, onRetrySync }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner && queuedItems === 0) return null;

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-40 offline-banner
        ${!isOnline ? 'bg-red-50 border-red-500 text-red-700' : 'bg-yellow-50 border-yellow-500 text-yellow-700'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {!isOnline ? (
                <WifiOff className="w-5 h-5" />
              ) : queuedItems > 0 ? (
                <Upload className="w-5 h-5" />
              ) : (
                <Wifi className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1">
              {!isOnline ? (
                <div>
                  <p className="font-medium">You're currently offline</p>
                  <p className="text-sm opacity-90">
                    Your reports will be saved and uploaded when connection is restored.
                  </p>
                </div>
              ) : queuedItems > 0 ? (
                <div>
                  <p className="font-medium">
                    {queuedItems} report{queuedItems !== 1 ? 's' : ''} queued for upload
                  </p>
                  <p className="text-sm opacity-90">
                    Syncing in the background...
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Connection restored</p>
                  <p className="text-sm opacity-90">All reports have been synced successfully.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {queuedItems > 0 && onRetrySync && (
              <button
                onClick={onRetrySync}
                className="
                  px-3 py-1 text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30
                  rounded-md transition-colors duration-200 focus:outline-none focus:ring-2
                  focus:ring-white focus:ring-opacity-50
                "
                aria-label="Retry sync"
              >
                Retry Sync
              </button>
            )}
            
            {isOnline && queuedItems === 0 && (
              <button
                onClick={() => setShowBanner(false)}
                className="
                  p-1 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
                "
                aria-label="Dismiss notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Progress indicator for queued items */}
        {queuedItems > 0 && (
          <div className="mt-2">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '60%' }} // Mock progress
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineBanner;