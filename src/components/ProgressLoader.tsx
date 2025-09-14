import React from 'react';

interface ProgressLoaderProps {
  progress: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress,
  label,
  size = 'md',
  variant = 'linear',
  color = 'primary',
  showPercentage = true,
  animated = true
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const colorClasses = {
    primary: 'bg-green-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const sizeClasses = {
    linear: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    },
    circular: {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    }
  };

  if (variant === 'circular') {
    const radius = size === 'sm' ? 14 : size === 'md' ? 20 : 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
      <div className="flex flex-col items-center space-y-2">
        {label && (
          <span className="text-sm font-medium text-gray-700" id="progress-label">
            {label}
          </span>
        )}
        <div className={`relative ${sizeClasses.circular[size]}`}>
          <svg
            className="transform -rotate-90 w-full h-full"
            viewBox={`0 0 ${(radius + 4) * 2} ${(radius + 4) * 2}`}
            role="progressbar"
            aria-valuenow={clampedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby={label ? "progress-label" : undefined}
          >
            {/* Background circle */}
            <circle
              cx={radius + 4}
              cy={radius + 4}
              r={radius}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx={radius + 4}
              cy={radius + 4}
              r={radius}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${colorClasses[color]} ${animated ? 'transition-all duration-300 ease-out' : ''}`}
              strokeLinecap="round"
            />
          </svg>
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700">
                {Math.round(clampedProgress)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-gray-700" id="progress-label">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-600">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div 
        className={`progress-bar ${sizeClasses.linear[size]}`}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={label ? "progress-label" : undefined}
      >
        <div
          className={`progress-fill ${colorClasses[color]} ${animated ? 'transition-all duration-300 ease-out' : ''}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressLoader;