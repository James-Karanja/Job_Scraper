import React, { useState, useEffect } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import UserProfileSetup from './pages/UserProfileSetup';
import JobHunterProfile from './pages/JobHunterProfile';
import OutreachResults from './pages/OutreachResults';

type ViewType = 'admin' | 'profile' | 'jobhunt' | 'outreach';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('admin');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Common props for all views
  const viewProps = {
    currentView,
    setCurrentView,
    darkMode,
    toggleTheme
  };

  return (
    <div className="h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden transition-colors duration-300 relative flex flex-col">
      <div className="flex-1 w-full overflow-hidden">
        {currentView === 'admin' && <AdminDashboard {...viewProps} />}
        {currentView === 'profile' && <UserProfileSetup {...viewProps} />}
        {currentView === 'jobhunt' && <JobHunterProfile {...viewProps} />}
        {currentView === 'outreach' && <OutreachResults {...viewProps} />}
      </div>
    </div>
  );
};

export default App;