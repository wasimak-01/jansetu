import React from 'react';

interface SkeletonLoaderProps {
  type: 'card' | 'list' | 'map' | 'form' | 'timeline' | 'stats';
  count?: number;
  className?: string;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4" role="status" aria-label="Loading content">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="skeleton h-5 w-3/4"></div>
        <div className="skeleton h-4 w-1/2"></div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full"></div>
        <div className="skeleton h-6 w-20 rounded-full"></div>
      </div>
    </div>
    <div className="skeleton h-4 w-full"></div>
    <div className="skeleton h-4 w-2/3"></div>
    <div className="flex items-center justify-between">
      <div className="skeleton h-4 w-32"></div>
      <div className="skeleton h-4 w-24"></div>
    </div>
    <span className="sr-only">Loading issue card...</span>
  </div>
);

const SkeletonList: React.FC = () => (
  <div className="space-y-3" role="status" aria-label="Loading list">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 bg-white rounded border">
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
        <div className="skeleton h-6 w-16 rounded-full"></div>
      </div>
    ))}
    <span className="sr-only">Loading list items...</span>
  </div>
);

const SkeletonMap: React.FC = () => (
  <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }} role="status" aria-label="Loading map">
    <div className="absolute inset-0 skeleton"></div>
    <div className="absolute top-4 left-4 right-4">
      <div className="skeleton h-10 w-full rounded-lg"></div>
    </div>
    <div className="absolute bottom-4 left-4">
      <div className="skeleton h-8 w-24 rounded-full"></div>
    </div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="skeleton w-8 h-8 rounded-full"></div>
    </div>
    <span className="sr-only">Loading map view...</span>
  </div>
);

const SkeletonForm: React.FC = () => (
  <div className="space-y-6" role="status" aria-label="Loading form">
    <div className="space-y-2">
      <div className="skeleton h-4 w-24"></div>
      <div className="skeleton h-10 w-full rounded-md"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="skeleton h-4 w-20"></div>
        <div className="skeleton h-10 w-full rounded-md"></div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-16"></div>
        <div className="skeleton h-10 w-full rounded-md"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="skeleton h-4 w-32"></div>
      <div className="skeleton h-24 w-full rounded-md"></div>
    </div>
    <div className="skeleton h-12 w-full rounded-lg"></div>
    <span className="sr-only">Loading form fields...</span>
  </div>
);

const SkeletonTimeline: React.FC = () => (
  <div className="space-y-4" role="status" aria-label="Loading timeline">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="skeleton w-3 h-3 rounded-full mt-2"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-48"></div>
          <div className="skeleton h-3 w-32"></div>
          <div className="skeleton h-3 w-24"></div>
        </div>
      </div>
    ))}
    <span className="sr-only">Loading timeline events...</span>
  </div>
);

const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="status" aria-label="Loading statistics">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton w-12 h-12 rounded-lg"></div>
          <div className="skeleton h-8 w-16"></div>
        </div>
        <div className="skeleton h-4 w-24 mb-1"></div>
        <div className="skeleton h-3 w-32"></div>
      </div>
    ))}
    <span className="sr-only">Loading statistics...</span>
  </div>
);

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return [...Array(count)].map((_, i) => <SkeletonCard key={i} />);
      case 'list':
        return <SkeletonList />;
      case 'map':
        return <SkeletonMap />;
      case 'form':
        return <SkeletonForm />;
      case 'timeline':
        return <SkeletonTimeline />;
      case 'stats':
        return <SkeletonStats />;
      default:
        return <div className="skeleton h-20 w-full"></div>;
    }
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;