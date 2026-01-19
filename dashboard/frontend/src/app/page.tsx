'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Clock,
  Settings,
  Search,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle,
  Database,
  ArrowUp,
  RotateCw
} from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Home() {
  const [status, setStatus] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [runMessage, setRunMessage] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchStatus();
    fetchSchedule();
    const interval = setInterval(fetchStatus, 10000); // Poll status every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/status`);
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Failed to fetch status', e);
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetch(`${API_URL}/schedule`);
      const data = await res.json();
      setSchedule(data);
    } catch (e) {
      console.error('Failed to fetch schedule', e);
    }
  };

  const handleRun = async () => {
    setLoading(true);
    setRunMessage('Starting workflow...');
    try {
      const res = await fetch(`${API_URL}/run`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        setRunMessage('Workflow completed successfully!');
        fetchStatus();
      } else {
        setRunMessage(`Error: ${data.message}`);
      }
    } catch (e) {
      setRunMessage('Network error occurred.');
    }
    setLoading(false);
  };

  const handleScheduleUpdate = async (hour: number, minute: number, active: boolean) => {
    // Optimistic update
    setSchedule({ hour, minute, active });
    try {
      const res = await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hour, minute, active }),
      });
      if (!res.ok) {
        alert('Failed to update schedule');
        fetchSchedule(); // Revert
      }
    } catch (e) {
      alert('Failed to update schedule');
      fetchSchedule(); // Revert
    }
  };

  return (
    <div className="bg-[#F0F4F8] dark:bg-[#0f172a] font-sans antialiased min-h-screen overflow-hidden flex flex-col md:flex-row transition-colors duration-300">

      {/* Sidebar / Aesthetic Panel */}
      <div className="relative w-full md:w-5/12 h-48 md:h-full overflow-hidden group bg-gradient-to-br from-blue-900 via-slate-900 to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>

        <div className="absolute inset-0 p-8 flex flex-col justify-between text-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-8 h-8 text-white dark:text-[#00f0ff] transition-colors" />
              <h1 className="text-xl font-semibold tracking-wide">Scraper<span className="font-light opacity-80">OS</span></h1>
            </div>

            {/* Mobile Controls */}
            <div className="flex space-x-2 md:hidden">
              {/* Controls hidden for mobile simplicity in this demo */}
            </div>
          </div>

          {/* System Status Float (Desktop) */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2 md:translate-y-0 md:top-auto md:bottom-32 w-64 hidden md:block">
            <div className="glass-panel text-white p-6 rounded-3xl shadow-2xl transition-transform hover:scale-105 duration-300 dark:border-white/10 dark:bg-slate-900/60 backdrop-blur-md bg-opacity-20 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium opacity-80">System Status</span>
                <div className={`flex items-center space-x-2 ${status?.status === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-yellow-400 text-black'} dark:bg-[#39ff14]/20 dark:border dark:border-[#39ff14]/50 dark:text-[#39ff14] text-xs font-bold px-2 py-0.5 rounded-full transition-colors border`}>
                  <span className={`w-1.5 h-1.5 ${status?.status === 'success' ? 'bg-green-400' : 'bg-black dark:bg-[#39ff14]'} rounded-full animate-pulse`}></span>
                  <span className="uppercase">{status?.status || 'Unknown'}</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="opacity-60">Last Run</span>
                  <span className="font-medium text-xs truncate max-w-[100px]">{status?.last_run ? new Date(status.last_run).toLocaleTimeString() : 'Never'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60">CPU Load</span>
                  <span className="font-medium text-green-400 dark:text-[#39ff14]">12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60">Proxies</span>
                  <span className="font-medium text-blue-300 dark:text-[#00f0ff]">Active</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="opacity-60">Queue</span>
                  <span className="font-medium">Idle</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto hidden md:block">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-2 dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              Job Data <br />
              Extraction
            </h2>
            <div className="flex items-center space-x-4 text-sm opacity-70">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="text-green-400 dark:text-[#39ff14]">Online</span>
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute top-1/3 right-12 w-32 h-32 border border-white/20 rounded-full flex items-center justify-center opacity-60 md:opacity-100 dark:border-white/10">
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="absolute top-2 right-4 text-xs font-bold text-yellow-400 dark:text-[#00f0ff]">64</span>
              <div className="w-2 h-2 bg-yellow-400 dark:bg-[#00f0ff] rounded-full absolute top-5 right-5 shadow-[0_0_10px_rgba(250,204,21,0.8)] dark:shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-7/12 h-full overflow-y-auto p-4 md:p-8 bg-[#F0F4F8] dark:bg-[#0f172a] transition-colors duration-300 relative">
        <div className="flex justify-between items-center mb-8 px-2 relative z-10">
          <div>
            <span className="text-xs font-bold text-[#6789BE] dark:text-[#00f0ff] uppercase tracking-wider">Dashboard</span>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-100">Control Center</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin User</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Super Admin</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white dark:border-gray-600 shadow-sm"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 h-auto relative z-10">

          {/* Run Scraper Panel */}
          <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#111827]/60 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-center items-center text-center relative overflow-hidden group transition-all duration-300 backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-[#EB4425] transform rotate-12" />
            </div>
            <div className="z-10 w-full max-w-md">
              <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Manual Override</h4>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Run Job Scraper</p>

              <button
                onClick={handleRun}
                disabled={loading}
                className={`relative w-full group py-4 px-6 rounded-xl bg-[#EB4425] hover:bg-orange-600 dark:hover:bg-[#EB4425]/90 text-white font-semibold shadow-lg shadow-[#EB4425]/30 hover:shadow-[#EB4425]/50 transition-all active:scale-95 flex items-center justify-center space-x-2 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <RotateCw className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Play className="w-5 h-5 text-white group-hover:fill-current" />
                )}
                <span>{loading ? 'Processing...' : 'Start Now'}</span>
              </button>

              <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center h-6">
                {runMessage ? (
                  <span className="text-blue-400">{runMessage}</span>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-green-400 dark:bg-[#39ff14] rounded-full mr-2 dark:shadow-[0_0_5px_rgba(57,255,20,0.8)]"></span>
                    Ready to launch
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Panel */}
          <div className="bg-white dark:bg-[#111827]/60 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl">
            <div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">Daily Schedule</h4>
              {schedule ? (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <div className="flex items-baseline">
                      <select
                        value={schedule.hour}
                        onChange={(e) => handleScheduleUpdate(parseInt(e.target.value), schedule.minute, schedule.active)}
                        className="text-3xl font-light text-gray-800 dark:text-gray-100 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i} className="bg-gray-800 text-sm">{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      <span className="mx-1 text-gray-300 dark:text-gray-600 text-3xl">:</span>
                      <select
                        value={schedule.minute}
                        onChange={(e) => handleScheduleUpdate(schedule.hour, parseInt(e.target.value), schedule.active)}
                        className="text-3xl font-light text-gray-800 dark:text-gray-100 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                      >
                        {Array.from({ length: 60 }).map((_, i) => (
                          <option key={i} value={i} className="bg-gray-800 text-sm">{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 ml-1">Daily</span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule.active}
                      onChange={(e) => handleScheduleUpdate(schedule.hour, schedule.minute, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#EB4425] dark:peer-checked:bg-[#EB4425]"></div>
                  </label>
                </div>
              ) : (
                <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              )}
            </div>

            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-xs text-gray-400 dark:text-gray-500">Next run in</div>
                  <div className="text-xs font-semibold inline-block text-[#EB4425]">
                    ~ 24h
                  </div>
                </div>
                <div className="overflow-hidden h-1.5 mb-1 text-xs flex rounded bg-[#EB4425]/10 dark:bg-gray-700">
                  <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#EB4425]" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Rate / Logs Link */}
          <div className="bg-white dark:bg-[#111827]/60 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-xl">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium w-full text-left mb-2">Success Rate</h4>
            <div className="relative w-40 h-40 flex items-center justify-center mt-2">
              <div className="text-4xl font-light text-gray-800 dark:text-gray-100">100<span className="text-lg font-normal">%</span></div>
              <div className="absolute w-full h-full border-8 border-gray-100 dark:border-gray-700 rounded-full"></div>
              <div className="absolute w-full h-full border-8 border-[#EB4425] rounded-full border-t-transparent border-l-transparent transform rotate-45"></div>
            </div>
            <button className="mt-6 px-4 py-1.5 bg-[#EB4425]/10 text-[#EB4425] text-xs font-semibold rounded-lg hover:bg-[#EB4425] hover:text-white transition-colors">
              View Logs
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
