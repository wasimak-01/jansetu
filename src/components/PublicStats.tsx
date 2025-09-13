import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, MapPin, Calendar } from 'lucide-react';
import type { Issue } from '../App';

interface PublicStatsProps {
  issues: Issue[];
}

const PublicStats: React.FC<PublicStatsProps> = ({ issues }) => {
  // Calculate statistics
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues * 100) : 0;
  
  // Category breakdown
  const categoryStats = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Status breakdown
  const statusStats = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Average resolution time (mock calculation)
  const resolvedIssuesWithTime = issues.filter(i => i.status === 'resolved');
  const avgResolutionHours = resolvedIssuesWithTime.length > 0 
    ? Math.round(resolvedIssuesWithTime.reduce((acc, issue) => {
        const resolutionTime = issue.updatedAt.getTime() - issue.createdAt.getTime();
        return acc + (resolutionTime / (1000 * 60 * 60));
      }, 0) / resolvedIssuesWithTime.length)
    : 0;

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentIssues = issues.filter(issue => issue.createdAt >= sevenDaysAgo);

  // SLA performance
  const onTimeResolutions = issues.filter(issue => 
    issue.status === 'resolved' && issue.updatedAt <= issue.slaDeadline
  ).length;
  const slaPerformance = resolvedIssues > 0 ? (onTimeResolutions / resolvedIssues * 100) : 0;

  const formatPercentage = (value: number) => `${Math.round(value)}%`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Impact Dashboard</h2>
        <p className="text-gray-600">
          Transparency in action - see how we're improving our community together.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{totalIssues}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Total Reports</h3>
          <p className="text-xs text-gray-500">Issues reported by community</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{formatPercentage(resolutionRate)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Resolution Rate</h3>
          <p className="text-xs text-gray-500">Issues successfully resolved</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{avgResolutionHours}h</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Avg Resolution</h3>
          <p className="text-xs text-gray-500">Average time to resolve</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{formatPercentage(slaPerformance)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">SLA Performance</h3>
          <p className="text-xs text-gray-500">On-time resolution rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Issue Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h3>
          <div className="space-y-4">
            {Object.entries(categoryStats)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => {
                const percentage = (count / totalIssues) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <span className="text-sm text-gray-600">{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="space-y-4">
            {Object.entries(statusStats).map(([status, count]) => {
              const percentage = (count / totalIssues) * 100;
              const statusConfig = {
                submitted: { color: 'bg-blue-600', label: 'Submitted' },
                reviewed: { color: 'bg-yellow-600', label: 'Under Review' },
                'in-progress': { color: 'bg-orange-600', label: 'In Progress' },
                resolved: { color: 'bg-green-600', label: 'Resolved' },
                closed: { color: 'bg-gray-600', label: 'Closed' }
              };

              const config = statusConfig[status as keyof typeof statusConfig];
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{config?.label || status}</span>
                    <span className="text-sm text-gray-600">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${config?.color || 'bg-gray-600'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Last 7 days</span>
          </div>
        </div>
        
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-blue-600 mb-2">{recentIssues.length}</div>
          <p className="text-gray-600">New issues reported this week</p>
          {recentIssues.length > 0 && (
            <div className="mt-4 text-left">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Latest Reports:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {recentIssues.slice(0, 5).map(issue => (
                  <div key={issue.id} className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{issue.title}</span>
                    <span className="text-xs text-gray-400">
                      {new Intl.DateTimeFormat('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      }).format(issue.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Community Impact Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Making Our Community Better</h3>
            <p className="text-gray-600 mb-4">
              Thanks to community participation, we've resolved {resolvedIssues} issues and maintain a{' '}
              {formatPercentage(slaPerformance)} on-time resolution rate. Your reports help us prioritize 
              improvements and keep our community safe and well-maintained.
            </p>
            <div className="text-sm text-gray-500">
              <p>• All reports are reviewed within 24 hours</p>
              <p>• High-priority safety issues are addressed immediately</p>
              <p>• Regular status updates keep you informed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicStats;