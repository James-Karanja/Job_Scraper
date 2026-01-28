import React from 'react';

interface DashboardHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ darkMode, toggleTheme }) => {
  return (
    <div className="flex justify-between items-center mb-6 md:mb-8 px-2 relative z-10">
      <div>
        <span className="text-xs font-bold text-accent-blue dark:text-neon-blue uppercase tracking-wider">Dashboard</span>
        <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark">Control Center</h3>
      </div>
      
      <div className="flex items-center space-x-4 pr-16 md:pr-20">
        <button className="hidden md:flex p-2 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
          <span className="material-icons text-xl">search</span>
        </button>
        
        {/* Profile and Settings are now handled by GlobalNavigation */}
      </div>
    </div>
  );
};

export default DashboardHeader;