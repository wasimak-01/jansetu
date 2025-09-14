import React, { useState, useEffect } from 'react';
import { MapPin, Camera, Clock, CheckCircle, AlertTriangle, Users, BarChart3 } from 'lucide-react';
import Header from './components/Header';
import IssueReportForm from './components/IssueReportForm';
import IssueTracker from './components/IssueTracker';
import Dashboard from './components/Dashboard';
import PublicStats from './components/PublicStats';
import Footer from './components/Footer';
import { ToastProvider } from './components/ToastContainer';
import AccessibilityControls from './components/AccessibilityControls';
import OfflineBanner from './components/OfflineBanner';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'reviewed' | 'in-progress' | 'resolved' | 'closed';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  reportedBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  slaDeadline: Date;
  timeline: {
    timestamp: Date;
    status: string;
    note?: string;
    updatedBy: string;
  }[];
}

function App() {
  const [currentView, setCurrentView] = useState<'report' | 'track' | 'dashboard' | 'stats'>('report');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [userType, setUserType] = useState<'citizen' | 'admin'>('citizen');
  const [queuedReports, setQueuedReports] = useState(0);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockIssues: Issue[] = [
      {
        id: '1',
        title: 'Pothole on Main Street',
        description: 'Large pothole causing damage to vehicles near the intersection',
        category: 'Roads & Infrastructure',
        priority: 'high',
        status: 'in-progress',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: '123 Main St, New York, NY 10001'
        },
        photos: ['https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg'],
        reportedBy: 'John Citizen',
        assignedTo: 'Road Maintenance Team',
        createdAt: new Date('2025-01-20T10:00:00Z'),
        updatedAt: new Date('2025-01-20T14:30:00Z'),
        slaDeadline: new Date('2025-01-22T10:00:00Z'),
        timeline: [
          {
            timestamp: new Date('2025-01-20T10:00:00Z'),
            status: 'submitted',
            note: 'Issue reported by citizen',
            updatedBy: 'John Citizen'
          },
          {
            timestamp: new Date('2025-01-20T11:15:00Z'),
            status: 'reviewed',
            note: 'Reviewed and prioritized as high',
            updatedBy: 'City Inspector'
          },
          {
            timestamp: new Date('2025-01-20T14:30:00Z'),
            status: 'in-progress',
            note: 'Assigned to road maintenance team',
            updatedBy: 'Operations Manager'
          }
        ]
      },
      {
        id: '2',
        title: 'Broken Streetlight',
        description: 'Streetlight not working, creating safety hazard',
        category: 'Public Safety',
        priority: 'medium',
        status: 'resolved',
        location: {
          lat: 40.7580,
          lng: -73.9855,
          address: '456 Oak Avenue, New York, NY 10002'
        },
        photos: [],
        reportedBy: 'Sarah Smith',
        assignedTo: 'Electrical Team',
        createdAt: new Date('2025-01-18T09:30:00Z'),
        updatedAt: new Date('2025-01-19T16:00:00Z'),
        slaDeadline: new Date('2025-01-20T09:30:00Z'),
        timeline: [
          {
            timestamp: new Date('2025-01-18T09:30:00Z'),
            status: 'submitted',
            note: 'Issue reported',
            updatedBy: 'Sarah Smith'
          },
          {
            timestamp: new Date('2025-01-18T14:00:00Z'),
            status: 'reviewed',
            note: 'Safety priority assigned',
            updatedBy: 'Safety Coordinator'
          },
          {
            timestamp: new Date('2025-01-19T08:30:00Z'),
            status: 'in-progress',
            note: 'Electrical team dispatched',
            updatedBy: 'Operations Manager'
          },
          {
            timestamp: new Date('2025-01-19T16:00:00Z'),
            status: 'resolved',
            note: 'Streetlight repaired and tested',
            updatedBy: 'Electrical Team'
          }
        ]
      }
    ];
    setIssues(mockIssues);
  }, []);

  const handleSubmitIssue = (newIssue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'slaDeadline' | 'timeline'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      slaDeadline: new Date(Date.now() + (newIssue.priority === 'urgent' ? 4 : newIssue.priority === 'high' ? 24 : 72) * 60 * 60 * 1000),
      timeline: [{
        timestamp: new Date(),
        status: 'submitted',
        note: 'Issue reported by citizen',
        updatedBy: newIssue.reportedBy
      }]
    };
    setIssues(prev => [issue, ...prev]);
    setCurrentView('track');
  };

  const handleUpdateIssue = (issueId: string, updates: Partial<Issue>, note?: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const updatedIssue = { ...issue, ...updates, updatedAt: new Date() };
        if (updates.status) {
          updatedIssue.timeline = [...issue.timeline, {
            timestamp: new Date(),
            status: updates.status,
            note,
            updatedBy: userType === 'admin' ? 'City Staff' : 'System'
          }];
        }
        return updatedIssue;
      }
      return issue;
    }));
  };

  return (
    <ToastProvider position="top-right">
      <div className="min-h-screen bg-gray-50">
        <OfflineBanner 
          queuedItems={queuedReports}
          onRetrySync={() => {
            // Mock retry sync
            setTimeout(() => setQueuedReports(0), 2000);
          }}
        />
        
        <Header 
          currentView={currentView}
          setCurrentView={setCurrentView}
          userType={userType}
          setUserType={setUserType}
        />
        
        <main className="pb-20">
          {currentView === 'report' && (
            <IssueReportForm onSubmit={handleSubmitIssue} />
          )}
          
          {currentView === 'track' && (
            <IssueTracker issues={issues} />
          )}
          
          {currentView === 'dashboard' && userType === 'admin' && (
            <Dashboard issues={issues} onUpdateIssue={handleUpdateIssue} />
          )}
          
          {currentView === 'stats' && (
            <PublicStats issues={issues} />
          )}
        </main>

        <Footer />
        
        <AccessibilityControls 
          onSettingsChange={setAccessibilitySettings}
        />
      </div>
    </ToastProvider>
  );
}

export default App;