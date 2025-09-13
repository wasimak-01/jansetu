import React from 'react';
import { MapPin, FileText, BarChart3, Settings, Users } from 'lucide-react';

interface HeaderProps {
  currentView: 'report' | 'track' | 'dashboard' | 'stats';
  setCurrentView: (view: 'report' | 'track' | 'dashboard' | 'stats') => void;
  userType: 'citizen' | 'admin';
  setUserType: (type: 'citizen' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  setCurrentView, 
  userType, 
  setUserType 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CivicReport</h1>
              <p className="text-xs text-gray-500">Making communities better</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setUserType(userType === 'citizen' ? 'admin' : 'citizen')}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              aria-label={`Switch to ${userType === 'citizen' ? 'admin' : 'citizen'} view`}
            >
              {userType === 'citizen' ? 'Admin' : 'Citizen'} View
            </button>
          </div>
        </div>
      </div>
      
      <nav className="border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setCurrentView('report')}
              className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                currentView === 'report'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={currentView === 'report' ? 'page' : undefined}
            >
              <FileText className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
            
            <button
              onClick={() => setCurrentView('track')}
              className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                currentView === 'track'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={currentView === 'track' ? 'page' : undefined}
            >
              <MapPin className="w-4 h-4" />
              <span>Track Issues</span>
            </button>
            
            {userType === 'admin' && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  currentView === 'dashboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={currentView === 'dashboard' ? 'page' : undefined}
              >
                <Settings className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
            
            <button
              onClick={() => setCurrentView('stats')}
              className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                currentView === 'stats'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={currentView === 'stats' ? 'page' : undefined}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Public Stats</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;