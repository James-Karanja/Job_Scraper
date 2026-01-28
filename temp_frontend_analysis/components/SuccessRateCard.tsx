import React from 'react';

interface SuccessRateCardProps {
  onViewLogs: () => void;
}

const SuccessRateCard: React.FC<SuccessRateCardProps> = ({ onViewLogs }) => {
  // SVG properties
  const size = 160;
  const center = size / 2;
  const radius = 60;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = 92;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-panel-light dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border-white/10 p-6 rounded-DEFAULT shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-between transition-all duration-300 min-h-[280px] relative">
      <h4 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest w-full text-center mb-2">Success Rate</h4>
      
      <div className="relative w-full max-w-[200px] aspect-square flex items-center justify-center flex-grow group">
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track (Dashed) */}
          <circle 
            className="text-gray-100 dark:text-gray-700/50 transition-colors" 
            cx={center} 
            cy={center} 
            fill="transparent" 
            r={radius} 
            stroke="currentColor" 
            strokeWidth={strokeWidth}
            strokeDasharray="4 4"
          ></circle>
          
          {/* Progress Circle (Solid) */}
          <circle 
            className="text-primary dark:text-primary transition-all duration-1000 ease-out" 
            cx={center} 
            cy={center} 
            fill="transparent" 
            r={radius} 
            stroke="currentColor" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            strokeWidth={strokeWidth}
            style={{ filter: 'drop-shadow(0 0 4px rgba(235,68,37,0.4))' }}
          ></circle>

           {/* Inner Decorative Ring */}
           <circle 
            className="text-gray-100 dark:text-white/5"
            cx={center} 
            cy={center} 
            fill="transparent" 
            r={radius - 15} 
            stroke="currentColor" 
            strokeWidth="1"
          ></circle>
        </svg>
        
        <div className="absolute flex flex-col items-center justify-center text-text-light dark:text-text-dark inset-0">
          <span className="text-5xl font-light group-hover:scale-110 transition-transform duration-300 font-display relative">
            {progress}
            <span className="text-base absolute -top-1 -right-4 text-gray-400">%</span>
            {/* Pulse effect under number */}
            <span className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse -z-10"></span>
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest border border-gray-100 dark:border-white/10 px-2 py-0.5 rounded-full">Optimal</span>
        </div>
      </div>
      
      <button 
        onClick={onViewLogs}
        className="mt-4 px-6 py-2 bg-transparent border border-gray-200 dark:border-white/20 text-gray-500 dark:text-gray-300 text-xs font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors active:scale-95 w-full md:w-auto flex items-center justify-center group"
      >
        <span className="material-icons text-sm mr-2 group-hover:animate-bounce">list_alt</span>
        VIEW LOGS
      </button>
    </div>
  );
};

export default SuccessRateCard;