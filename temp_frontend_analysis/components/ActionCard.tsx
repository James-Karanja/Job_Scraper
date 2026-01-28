import React, { useState } from 'react';

const ActionCard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStart = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsRunning(true);
      setTimeout(() => setIsRunning(false), 5000); // Reset after 5s for demo
    }, 2000);
  };

  return (
    <div className="bg-panel-light dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border-white/10 p-6 rounded-DEFAULT shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-center items-center text-center relative overflow-hidden group transition-all duration-300 min-h-[250px]">
      
      {/* Organic Breathing Background - The "Orb" Effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-primary/10 to-accent-blue/10 dark:from-primary/20 dark:to-neon-blue/20 blur-[60px] transition-all duration-[3000ms] ${isRunning ? 'scale-150 opacity-100' : 'scale-100 opacity-50 group-hover:scale-110'}`}></div>
      
      <div className="z-10 w-full flex flex-col items-center">
        <div className="mb-6 relative">
             <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Manual Override</h4>
             <p className={`text-3xl font-display font-light text-text-light dark:text-text-dark transition-all duration-500 relative z-10 ${isRunning ? 'tracking-widest' : ''}`}>
               {isRunning ? "System Active" : "Run Now"}
             </p>
        </div>
        
        <button 
          onClick={handleStart}
          disabled={isRunning || isProcessing}
          className={`
            relative w-24 h-24 rounded-full shadow-2xl transition-all duration-500 flex flex-col items-center justify-center overflow-hidden group
            ${isRunning 
              ? 'bg-green-500 shadow-green-500/40 scale-110' 
              : 'bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-primary/20 active:scale-95'}
          `}
        >
          {/* Ripple rings animation when idle */}
          {!isRunning && !isProcessing && (
            <div className="absolute inset-0 rounded-full border border-primary/20 scale-75 animate-ping pointer-events-none"></div>
          )}

          {isProcessing ? (
             <span className="material-icons animate-spin text-gray-500 dark:text-white text-3xl">sync</span>
          ) : isRunning ? (
             <span className="material-icons text-white text-4xl">check</span>
          ) : (
             <span className="material-icons text-primary text-4xl group-hover:scale-110 transition-transform duration-300">power_settings_new</span>
          )}
        </button>
        
        <div className="mt-8 text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
          {isRunning ? "Sequence Initialized" : "Waiting for input..."}
        </div>
      </div>
    </div>
  );
};

export default ActionCard;