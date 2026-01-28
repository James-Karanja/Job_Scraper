import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import GlobalNavigation from '../components/GlobalNavigation';
import StatChart from '../components/StatChart';
import ActionCard from '../components/ActionCard';
import ScheduleCard from '../components/ScheduleCard';
import SuccessRateCard from '../components/SuccessRateCard';
import DataSourcesCard from '../components/DataSourcesCard';
import LogsPanel from '../components/LogsPanel';

type ViewType = 'admin' | 'profile' | 'jobhunt' | 'outreach';

interface AdminDashboardProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentView, setCurrentView, darkMode, toggleTheme }) => {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Logs Panel Overlay */}
      <LogsPanel isOpen={showLogs} onClose={() => setShowLogs(false)} />

      {/* Left Sidebar - Visual Panel */}
      <Sidebar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Main Dashboard Area */}
      <main className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark transition-colors duration-300 relative pt-20 md:pt-0">
        
        {/* Sticky Header inside Main Area */}
        <GlobalNavigation 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
        />

        {/* Ambient Background Effects (Dark Mode) */}
        <div className="fixed top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0 hidden dark:block">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px]"></div>
        </div>

        {/* Content Container */}
        <div className="p-4 md:p-8 relative z-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 h-auto">
            {/* Main Chart */}
            <div className="col-span-1 md:col-span-2">
              <StatChart />
            </div>

            {/* Action Card */}
            <ActionCard />

            {/* Schedule Card */}
            <ScheduleCard />

            {/* Success Rate */}
            <SuccessRateCard onViewLogs={() => setShowLogs(true)} />

            {/* Data Sources */}
            <DataSourcesCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;