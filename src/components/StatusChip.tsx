import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Eye, XCircle } from 'lucide-react';

interface StatusChipProps {
  status: 'submitted' | 'reviewed' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  slaDeadline?: Date;
  showETA?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  submitted: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Clock, 
    label: 'Submitted',
    description: 'Report received and queued for review'
  },
  reviewed: { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: Eye, 
    label: 'Under Review',
    description: 'Being evaluated by city staff'
  },
  'in-progress': { 
    color: 'bg-orange-100 text-orange-800 border-orange-200', 
    icon: AlertTriangle, 
    label: 'In Progress',
    description: 'Work has begun on this issue'
  },
  resolved: { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle, 
    label: 'Resolved',
    description: 'Issue has been fixed'
  },
  closed: { 
    color: 'bg-gray-100 text-gray-800 border-gray-200', 
    icon: XCircle, 
    label: 'Closed',
    description: 'Issue completed and archived'
  }
};

const StatusChip: React.FC<StatusChipProps> = ({ 
  status, 
  priority, 
  slaDeadline, 
  showETA = false, 
  animated = true,
  size = 'md'
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!slaDeadline || !showETA) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = slaDeadline.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Overdue');
        setIsOverdue(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
      
      setIsOverdue(false);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [slaDeadline, showETA]);

  const config = statusConfig[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-2">
      <span 
        className={`
          inline-flex items-center rounded-full font-medium border
          ${config.color} 
          ${sizeClasses[size]}
          ${animated ? 'transition-all duration-200 ease-out' : ''}
          ${priority === 'urgent' ? 'ring-2 ring-red-300 ring-opacity-50' : ''}
        `}
        role="status"
        aria-label={`Status: ${config.label}. ${config.description}`}
      >
        <Icon className={`${iconSizes[size]} mr-1.5`} aria-hidden="true" />
        <span>{config.label}</span>
      </span>
      
      {showETA && slaDeadline && (
        <span 
          className={`
            eta-countdown
            ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}
            ${animated ? 'transition-colors duration-200' : ''}
          `}
          aria-label={`Time remaining: ${timeLeft}`}
        >
          {timeLeft}
        </span>
      )}
    </div>
  );
};

export default StatusChip;