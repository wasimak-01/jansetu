import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, CheckCircle, AlertTriangle, Eye, Calendar } from 'lucide-react';
import StatusChip from './StatusChip';
import EnhancedTimeline from './EnhancedTimeline';
import SkeletonLoader from './SkeletonLoader';
import type { Issue } from '../App';

interface IssueTrackerProps {
  issues: Issue[];
}

const statusConfig = {
  submitted: { color: 'bg-blue-100 text-blue-800', icon: Clock },
  reviewed: { color: 'bg-yellow-100 text-yellow-800', icon: Eye },
  'in-progress': { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  closed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
};

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-800' },
  medium: { color: 'bg-blue-100 text-blue-800' },
  high: { color: 'bg-orange-100 text-orange-800' },
  urgent: { color: 'bg-red-100 text-red-800' }
};

const IssueTracker: React.FC<IssueTrackerProps> = ({ issues }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesCategory = !categoryFilter || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(issues.map(issue => issue.category))];
  const statuses = [...new Set(issues.map(issue => issue.status))];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSLAStatus = (issue: Issue) => {
    const now = new Date();
    const timeLeft = issue.slaDeadline.getTime() - now.getTime();
    const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
    
    if (issue.status === 'resolved' || issue.status === 'closed') {
      return { status: 'met', text: 'SLA Met', color: 'text-green-600' };
    }
    
    if (hoursLeft <= 0) {
      return { status: 'overdue', text: 'Overdue', color: 'text-red-600' };
    }
    
    if (hoursLeft <= 8) {
      return { status: 'warning', text: `${hoursLeft}h left`, color: 'text-orange-600' };
    }
    
    return { status: 'ok', text: `${hoursLeft}h left`, color: 'text-gray-600' };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Issues</h2>
        <p className="text-gray-600">Monitor the status of reported community issues.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search issues by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {isLoading ? (
          <SkeletonLoader type="card" count={3} />
        ) : (
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600">No issues found matching your criteria.</p>
          </div>
        ) : (
          filteredIssues.map(issue => {
            const StatusIcon = statusConfig[issue.status].icon;
            const slaStatus = getSLAStatus(issue);
            
            return (
              <div
                key={issue.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover cursor-pointer"
                onClick={() => setSelectedIssue(issue)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedIssue(issue);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{issue.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{issue.location.address}</span>
                      <span className="text-gray-400">•</span>
                      <span>#{issue.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <StatusChip
                      status={issue.status}
                      priority={issue.priority}
                      slaDeadline={issue.slaDeadline}
                      showETA={true}
                      size="sm"
                    />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{issue.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {formatDate(issue.createdAt)}
                    </span>
                    <span className="text-gray-600">
                      Category: {issue.category}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-1 font-medium ${slaStatus.color}`}>
                    <Clock className="w-4 h-4" />
                    <span>{slaStatus.text}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{selectedIssue.title}</h3>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {(() => {
                const SelectedIssueStatusIcon = statusConfig[selectedIssue.status].icon;
                return (
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedIssue.status].color}`}>
                  <SelectedIssueStatusIcon className="w-4 h-4 mr-2" />
                  {selectedIssue.status.charAt(0).toUpperCase() + selectedIssue.status.slice(1).replace('-', ' ')}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[selectedIssue.priority].color}`}>
                  {selectedIssue.priority.charAt(0).toUpperCase() + selectedIssue.priority.slice(1)} Priority
                </span>
              </div>
                );
              })()}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedIssue.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedIssue.location.address}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Reported By:</span>
                    <p className="font-medium">{selectedIssue.reportedBy}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium">{selectedIssue.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">{formatDate(selectedIssue.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <p className="font-medium">{formatDate(selectedIssue.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              {selectedIssue.photos.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Photos</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIssue.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Issue photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                <EnhancedTimeline
                  events={selectedIssue.timeline}
                  showTimeDelta={true}
                  showEvidence={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueTracker;