import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { supabase } from '../src/lib/supabase';


interface LogsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_LOGS: LogEntry[] = [];


const LogsPanel: React.FC<LogsPanelProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [filter, setFilter] = useState<'ALL' | 'ERROR' | 'WARN'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Realtime subscription to logs
  useEffect(() => {
    if (!isOpen) return;

    // Load initial logs
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('logs')
        .select('*')
        .order('id', { ascending: false })
        .limit(100);

      if (data) {
        // Map DB logs to UI format
        const formattedLogs: LogEntry[] = data.reverse().map((l: any) => ({
          id: l.id.toString(),
          timestamp: new Date(l.created_at).toLocaleTimeString('en-US', { hour12: false }),
          level: l.level,
          message: l.message,
          source: 'System'
        }));
        setLogs(formattedLogs);
      }
    };

    fetchLogs();

    // Subscribe to new logs
    const channel = supabase
      .channel('logs-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs' }, (payload) => {
        const newLogRaw = payload.new;
        const newLog: LogEntry = {
          id: newLogRaw.id.toString(),
          timestamp: new Date(newLogRaw.created_at).toLocaleTimeString('en-US', { hour12: false }),
          level: newLogRaw.level as any,
          message: newLogRaw.message,
          source: 'System'
        };

        setLogs(prev => [...prev.slice(-99), newLog]);

        // Auto scroll
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);


  // Scroll to bottom on open
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
      }, 100);
    }
  }, [isOpen]);

  const filteredLogs = logs.filter(log =>
    filter === 'ALL' ? true : log.level === filter
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-l border-gray-200 dark:border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-[#0f172a]/50">
          <div>
            <h2 className="text-lg font-semibold text-text-light dark:text-text-dark flex items-center">
              <span className="material-icons mr-2 text-primary">terminal</span>
              System Logs
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-gray-500 font-mono">LIVE CONNECTED</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-white/10 flex space-x-2 bg-gray-50/50 dark:bg-white/5">
          {(['ALL', 'ERROR', 'WARN'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === f
                  ? 'bg-white dark:bg-white/10 text-primary shadow-sm border border-gray-200 dark:border-transparent'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
            >
              {f}
            </button>
          ))}
          <div className="flex-grow" />
          <button
            onClick={() => setLogs([])}
            className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center"
          >
            <span className="material-icons text-[14px] mr-1">block</span>
            Clear
          </button>
        </div>

        {/* Log List */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-4 space-y-2 font-mono text-xs md:text-sm bg-gray-50 dark:bg-black/20"
        >
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors group">
              <span className="text-gray-400 shrink-0 select-none">{log.timestamp}</span>

              <span className={`shrink-0 px-1.5 rounded-[3px] font-bold text-[10px] tracking-wider w-16 text-center select-none ${log.level === 'INFO' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' :
                  log.level === 'SUCCESS' ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' :
                    log.level === 'WARN' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                {log.level}
              </span>

              <div className="flex-grow break-all text-gray-700 dark:text-gray-300">
                <span className="opacity-50 mr-2 text-[10px] uppercase border border-gray-200 dark:border-gray-700 rounded px-1">{log.source}</span>
                {log.message}
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50">
              <span className="material-icons text-4xl">filter_list_off</span>
              <span>No logs found</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 text-center border-t border-gray-200 dark:border-white/10 text-[10px] text-gray-400 bg-white dark:bg-[#0f172a]">
          ScraperOS Logger v2.4.1 • {logs.length} entries stored
        </div>
      </div>
    </>
  );
};

export default LogsPanel;