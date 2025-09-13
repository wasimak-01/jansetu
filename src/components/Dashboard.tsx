import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, Users, Calendar, Filter, Search, Eye, UserCheck } from 'lucide-react';
import type { Issue } from '../App';

interface DashboardProps {
  issues: Issue[];
  onUpdateIssue: (id: string, updates: Partial<Issue>, note?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ issues, onUpdateIssue }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'triage' | 'sla'>('overview');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Calculate stats
  const stats = {
    total: issues.length,
    submitted: issues.filter(i => i.status === 'submitted').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    overdue: issues.filter(i => {
      const now = new Date();
      return i.slaDeadline < now && !['resolved', 'closed'].includes(i.status);
    }).length
  };

  const getSLAStatus = (issue: Issue) => {
    const now = new Date();
    const timeLeft = issue.slaDeadline.getTime() - now.getTime();
    const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
    
    if (issue.status === 'resolved' || issue.status === 'closed') {
      return { status: 'met', text: 'Met', color: 'text-green-600' };
    }
    
    if (hoursLeft <= 0) {
      return { status: 'overdue', text: 'Overdue', color: 'text-red-600' };
    }
    
    if (hoursLeft <= 8) {
      return { status: 'warning', text: `${hoursLeft}h`, color: 'text-orange-600' };
    }
    
    return { status: 'ok', text: `${hoursLeft}h`, color: 'text-gray-600' };
  };

  const handleStatusUpdate = (issueId: string, newStatus: Issue['status']) => {
    const statusNotes = {
      'reviewed': 'Issue reviewed and prioritized by staff',
      'in-progress': 'Work has begun on this issue',
      'resolved': 'Issue has been resolved',
      'closed': 'Issue closed and completed'
    };
    
    onUpdateIssue(issueId, { status: newStatus }, statusNotes[newStatus] || `Status updated to ${newStatus}`);
  };

  const handleAssign = (issueId: string, assignee: string) => {
    onUpdateIssue(issueId, { assignedTo: assignee }, `Assigned to ${assignee}`);
  };

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Municipal Dashboard</h2>
        <p className="text-gray-600">Manage and track community issues efficiently.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Submitted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'triage', label: 'Triage Queue', icon: Filter },
              { id: 'sla', label: 'SLA Monitor', icon: Clock }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="reviewed">Reviewed</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Issues</h3>
              {filteredIssues.slice(0, 10).map(issue => {
                const slaStatus = getSLAStatus(issue);
                return (
                  <div key={issue.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{issue.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{issue.location.address}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            issue.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            issue.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {issue.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${
                            issue.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            issue.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                            issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {issue.status}
                          </span>
                          <span className={`font-medium ${slaStatus.color}`}>
                            SLA: {slaStatus.text}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'triage' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Issues Requiring Action</h3>
              {filteredIssues.filter(i => ['submitted', 'reviewed'].includes(i.status)).map(issue => (
                <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{issue.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{issue.description.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          issue.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.priority} priority
                        </span>
                        <span className="text-gray-500">
                          Reported {formatDate(issue.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <select
                      onChange={(e) => {
                        const newStatus = e.target.value as Issue['status'];
                        if (newStatus) handleStatusUpdate(issue.id, newStatus);
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      defaultValue=""
                    >
                      <option value="">Update Status</option>
                      <option value="reviewed">Mark as Reviewed</option>
                      <option value="in-progress">Start Work</option>
                      <option value="resolved">Mark Resolved</option>
                    </select>
                    
                    <select
                      onChange={(e) => {
                        const assignee = e.target.value;
                        if (assignee) handleAssign(issue.id, assignee);
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      defaultValue=""
                    >
                      <option value="">Assign to Team</option>
                      <option value="Road Maintenance Team">Road Maintenance</option>
                      <option value="Electrical Team">Electrical</option>
                      <option value="Parks Department">Parks</option>
                      <option value="Water Department">Water/Utilities</option>
                    </select>
                    
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SLA Monitoring</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIssues.map(issue => {
                      const slaStatus = getSLAStatus(issue);
                      return (
                        <tr key={issue.id} className={slaStatus.status === 'overdue' ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                              <div className="text-sm text-gray-500">#{issue.id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              issue.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              issue.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {issue.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-medium ${slaStatus.color}`}>
                              {slaStatus.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(issue.slaDeadline)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Issue Detail Modal (reused from IssueTracker) */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{selectedIssue.title}</h3>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedIssue.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as Issue['status'];
                      handleStatusUpdate(selectedIssue.id, newStatus);
                      setSelectedIssue({ ...selectedIssue, status: newStatus });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    value={selectedIssue.assignedTo || ''}
                    onChange={(e) => {
                      const assignee = e.target.value;
                      if (assignee !== selectedIssue.assignedTo) {
                        handleAssign(selectedIssue.id, assignee);
                        setSelectedIssue({ ...selectedIssue, assignedTo: assignee });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    <option value="Road Maintenance Team">Road Maintenance Team</option>
                    <option value="Electrical Team">Electrical Team</option>
                    <option value="Parks Department">Parks Department</option>
                    <option value="Water Department">Water Department</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedIssue.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedIssue.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">{event.status} - {formatDate(event.timestamp)}</div>
                        {event.note && <div className="text-gray-600">{event.note}</div>}
                        <div className="text-gray-500">by {event.updatedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;