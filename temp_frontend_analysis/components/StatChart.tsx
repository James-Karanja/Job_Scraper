import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { ChartDataPoint } from '../types';

const data: ChartDataPoint[] = [
  { name: '01', value: 30, status: 'idle' },
  { name: '02', value: 45, status: 'idle' },
  { name: '03', value: 35, status: 'idle' },
  { name: '04', value: 50, status: 'active' },
  { name: '05', value: 65, status: 'active' },
  { name: '06', value: 80, status: 'active' },
  { name: '07', value: 95, status: 'active' },
  { name: '08', value: 70, status: 'active' },
  { name: '09', value: 60, status: 'active' },
  { name: '10', value: 50, status: 'idle' },
  { name: '11', value: 40, status: 'idle' },
  { name: '12', value: 25, status: 'idle' },
  { name: '13', value: 35, status: 'idle' },
  { name: '14', value: 45, status: 'idle' },
  { name: '15', value: 55, status: 'idle' },
];

const StatChart: React.FC = () => {
  return (
    <div className="bg-panel-light dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border-white/10 p-6 rounded-DEFAULT shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between transition-all duration-300 w-full h-64 md:h-72">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Scraped Listings</h4>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-text-light dark:text-text-dark">12,450</span>
            <span className="text-green-500 dark:text-neon-green text-xs font-semibold flex items-center">
              <span className="material-icons text-sm mr-0.5">arrow_upward</span> 15%
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className="text-xs text-gray-400 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">Last 24h</span>
        </div>
      </div>

      <div className="flex-grow w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  className={`transition-all duration-300 ${
                    entry.status === 'active' 
                      ? 'fill-primary dark:fill-primary hover:opacity-80' 
                      : 'fill-gray-200 dark:fill-gray-700 hover:fill-gray-300 dark:hover:fill-gray-600'
                  }`}
                  style={{
                    filter: entry.status === 'active' && entry.value > 80 ? 'drop-shadow(0 0 4px rgba(235,68,37,0.4))' : 'none'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-4 text-xs text-gray-400 dark:text-gray-400 font-medium">
        <span>Job Speed</span>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="w-2 h-0.5 bg-gray-300 dark:bg-gray-600 mr-2 rounded-full"></span>
            idle
          </span>
          <span className="flex items-center">
            <span className="w-2 h-0.5 bg-primary mr-2 rounded-full"></span>
            active
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatChart;