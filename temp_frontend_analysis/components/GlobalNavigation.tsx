import React, { useState } from 'react';

type ViewType = 'admin' | 'profile' | 'jobhunt' | 'outreach';

interface GlobalNavigationProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const GlobalNavigation: React.FC<GlobalNavigationProps> = ({ currentView, setCurrentView, darkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'admin', icon: 'dashboard', label: 'Dashboard' },
    { id: 'profile', icon: 'person_edit', label: 'Profile Setup' },
    { id: 'jobhunt', icon: 'work_history', label: 'Job Hunt' },
    { id: 'outreach', icon: 'send', label: 'Outreach' },
  ];

  const getTitle = () => {
    switch (currentView) {
      case 'admin': return { sup: 'DASHBOARD', main: 'Control Center' };
      case 'profile': return { sup: 'SETTINGS', main: 'Profile Setup' };
      case 'jobhunt': return { sup: 'CONFIGURATION', main: 'Job Hunter' };
      case 'outreach': return { sup: 'CAMPAIGNS', main: 'Outreach Results' };
      default: return { sup: 'SCRA PEROS', main: 'Control Panel' };
    }
  };

  const title = getTitle();

  return (
    <>
      {/* 
         Navigation Header 
         Mobile: Fixed at top (z-100) covering everything.
         Desktop: Sticky at top of content area (z-40), allowing sidebar to be visible on left.
      */}
      <header className={`
        fixed top-0 left-0 right-0 md:static md:top-0 md:w-full 
        h-20 z-[100] md:z-40 
        bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl 
        md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none
        border-b border-gray-200 dark:border-white/10 md:border-none
        transition-all duration-300
      `}>
        <div className="h-full w-full px-6 py-4 flex items-center justify-between">
          
          {/* Left: Title Area */}
          <div className="flex flex-col justify-center animate-fadeIn md:pl-2">
            <span className="text-[10px] font-bold text-accent-blue dark:text-neon-blue uppercase tracking-widest mb-0.5">
              {title.sup}
            </span>
            <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark tracking-tight leading-none">
              {title.main}
            </h1>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center space-x-4 md:space-x-6">
            
            {/* Search (Desktop) */}
            <div className="hidden md:flex relative group">
              <input 
                type="text" 
                placeholder="Search system..." 
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-48 focus:w-64 transition-all duration-300 outline-none focus:ring-1 focus:ring-primary/50 text-gray-600 dark:text-gray-300 placeholder-gray-400 shadow-sm"
              />
              <span className="material-icons absolute left-3 top-2 text-gray-400">search</span>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Separator */}
            <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 outline-none ring-2 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ${isOpen ? 'ring-primary' : 'ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700'}`}
              >
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATtMQohjgXjHE0b2xPeXAJTpjT-K8opfSnTXS3-w_nCbNLUfgkz9vMio-anAVQfItWshKM5_mVeEdtS8Njn-iEA65GLnih-qVL5ssYFXjBAFzucRascTjXyxsVMbhIrMX4YCepZmEQTy7TwZLdxoxoUEV3z73CwtjmUn2VyGoVGv9Nokewnid_vIcOkRATRCDRqx1WQru6aDN-mApBa7Tm8Y5hLBIBQoEJC82V_-Nq6YwcBF-rJmDkeWg9TGi7aWkODyO_3BsG0OE" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10"
                />
                {/* Status Dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                  <div className="absolute right-0 top-14 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden transform transition-all duration-200 origin-top-right animate-in fade-in zoom-in-95">
                    
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">Alex Donovan</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">alex.donovan@example.com</p>
                    </div>

                    <div className="p-2 space-y-1">
                      {menuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentView(item.id as ViewType);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                            ${currentView === item.id 
                              ? 'bg-primary/10 text-primary dark:text-white dark:bg-primary/20' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                            }
                          `}
                        >
                          <span className={`material-symbols-outlined text-[20px] ${currentView === item.id ? 'fill-current' : ''}`}>{item.icon}</span>
                          {item.label}
                          {currentView === item.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>}
                        </button>
                      ))}
                    </div>

                    <div className="p-2 border-t border-gray-100 dark:border-white/5">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default GlobalNavigation;