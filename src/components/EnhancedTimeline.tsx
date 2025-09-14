import React from 'react';
import { Clock, User, FileText, CheckCircle, AlertTriangle, Eye, XCircle } from 'lucide-react';

interface TimelineEvent {
  timestamp: Date;
  status: string;
  note?: string;
  updatedBy: string;
  evidence?: {
    type: 'photo' | 'document' | 'note';
    url?: string;
    description: string;
  }[];
}

interface EnhancedTimelineProps {
  events: TimelineEvent[];
  showTimeDelta?: boolean;
  showEvidence?: boolean;
  compact?: boolean;
}

const statusConfig = {
  submitted: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  reviewed: { icon: Eye, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'in-progress': { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
  resolved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  closed: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100' }
};

const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({
  events,
  showTimeDelta = true,
  showEvidence = true,
  compact = false
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatTimeDelta = (current: Date, previous?: Date) => {
    if (!previous) return null;
    
    const diff = current.getTime() - previous.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h later`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m later`;
    } else {
      return `${minutes}m later`;
    }
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted;
  };

  return (
    <div className="space-y-4" role="log" aria-label="Issue timeline">
      {events.map((event, index) => {
        const config = getStatusConfig(event.status);
        const Icon = config.icon;
        const previousEvent = index > 0 ? events[index - 1] : undefined;
        const timeDelta = showTimeDelta ? formatTimeDelta(event.timestamp, previousEvent?.timestamp) : null;
        
        return (
          <div key={index} className="relative">
            {/* Timeline line */}
            {index < events.length - 1 && (
              <div 
                className="absolute left-4 top-8 w-0.5 bg-gray-200 -bottom-4"
                aria-hidden="true"
              />
            )}
            
            <div className="flex items-start gap-4">
              {/* Status icon */}
              <div 
                className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${config.bg} ring-4 ring-white
                `}
                aria-hidden="true"
              >
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 capitalize">
                    {event.status.replace('-', ' ')}
                  </h4>
                  {timeDelta && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {timeDelta}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <Clock className="w-3 h-3" />
                  <time dateTime={event.timestamp.toISOString()}>
                    {formatDate(event.timestamp)}
                  </time>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{event.updatedBy}</span>
                  </div>
                </div>
                
                {event.note && (
                  <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} mb-2`}>
                    {event.note}
                  </p>
                )}
                
                {/* Evidence */}
                {showEvidence && event.evidence && event.evidence.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <h5 className="text-xs font-medium text-gray-700">Evidence:</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {event.evidence.map((item, evidenceIndex) => (
                        <div 
                          key={evidenceIndex}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                        >
                          <div className="flex-shrink-0">
                            {item.type === 'photo' && (
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {item.type === 'document' && (
                              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                <FileText className="w-4 h-4 text-green-600" />
                              </div>
                            )}
                            {item.type === 'note' && (
                              <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                                <FileText className="w-4 h-4 text-yellow-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-700 truncate">
                              {item.description}
                            </p>
                            {item.url && (
                              <a 
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnhancedTimeline;