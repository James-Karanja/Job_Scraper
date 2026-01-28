import React from 'react';
import { DataSource } from '../types';

const sources: DataSource[] = [
  { name: 'LinkedIn', count: 4200, color: 'bg-blue-600', darkColor: 'dark:bg-blue-500', percent: 70 },
  { name: 'Indeed', count: 1850, color: 'bg-blue-400', darkColor: 'dark:bg-neon-blue', percent: 45 },
  { name: 'Glassdoor', count: 890, color: 'bg-green-400', darkColor: 'dark:bg-neon-green', percent: 25 },
];

const DataSourcesCard: React.FC = () => {
  return (
    <div className="bg-panel-light dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border-white/10 p-6 rounded-DEFAULT shadow-sm border border-gray-100 dark:border-gray-700/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">Data Sources</h4>
        
        <div className="space-y-6">
          {sources.map((source) => (
            <div key={source.name} className="group cursor-pointer">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-text-light dark:text-text-dark group-hover:text-primary transition-colors">{source.name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-400">{source.count.toLocaleString()} records</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${source.color} ${source.darkColor} transition-all duration-1000 ease-out group-hover:brightness-110`} 
                  style={{ 
                    width: `${source.percent}%`,
                    boxShadow: source.name === 'Indeed' ? '0 0 5px rgba(0,240,255,0.5)' : source.name === 'Glassdoor' ? '0 0 5px rgba(57,255,20,0.5)' : source.name === 'LinkedIn' ? '0 0 5px rgba(59,130,246,0.5)' : 'none'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
        <span className="text-xs text-gray-400 dark:text-gray-500">Total: {sources.length} Sources</span>
        <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-primary transition">
          <span className="material-icons text-lg">settings</span>
        </button>
      </div>
    </div>
  );
};

export default DataSourcesCard;