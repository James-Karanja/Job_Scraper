import React, { useState, useRef, useEffect } from 'react';

interface SidebarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleTheme }) => {
  const [showStatus, setShowStatus] = useState(true);
  
  // Dragging State (Desktop)
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef({ startY: 0, startOffset: 0, maxOffset: 0 });

  // Visualizer Interaction State
  const [activeNode, setActiveNode] = useState<'source' | 'process' | 'db' | null>(null);

  // Mobile State
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;

    e.preventDefault();
    
    let max = 0; 
    if (cardRef.current && containerRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        let bottomBoundaryY = containerRect.bottom;
        if (bottomRef.current) {
            const bottomRect = bottomRef.current.getBoundingClientRect();
            if (bottomRect.height > 0) {
                 bottomBoundaryY = bottomRect.top;
            }
        }
        
        const currentTop = cardRect.top;
        const baseTop = currentTop - offsetY;
        max = bottomBoundaryY - baseTop - cardRect.height - 32; 
    }

    dragInfo.current = {
        startY: e.clientY,
        startOffset: offsetY,
        maxOffset: Math.max(0, max)
    };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - dragInfo.current.startY;
      let newOffset = dragInfo.current.startOffset + deltaY;
      newOffset = Math.max(0, Math.min(newOffset, dragInfo.current.maxOffset));
      setOffsetY(newOffset);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <>
      {/* 
        MOBILE IMPLEMENTATION: Floating Status Widget 
        Replaces the gap-causing static sidebar header with a sleek floating UI
      */}
      <div className="md:hidden">
        {/* Backdrop for expanded state */}
        <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${mobileExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMobileExpanded(false)}
        />

        {/* Floating Pill / Bottom Sheet */}
        <div className={`fixed z-50 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${mobileExpanded ? 'bottom-0 left-0 right-0 p-4' : 'bottom-6 right-6'}`}>
          <div 
            onClick={() => !mobileExpanded && setMobileExpanded(true)}
            className={`
                bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden
                ${mobileExpanded ? 'rounded-3xl w-full' : 'rounded-full h-14 pl-2 pr-6 flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95'}
            `}
          >
            {/* Collapsed State Content */}
            <div className={`flex items-center gap-3 ${mobileExpanded ? 'hidden' : 'flex'}`}>
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center relative">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse absolute"></span>
                    <span className="material-icons text-green-400 text-lg">dns</span>
                </div>
                <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">System</div>
                    <div className="text-xs text-white font-bold leading-none">Running</div>
                </div>
            </div>

            {/* Expanded State Content (Bottom Sheet Style) */}
            <div className={`${mobileExpanded ? 'block' : 'hidden'}`}>
                <div className="p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-white font-bold text-lg">System Status</span>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setMobileExpanded(false); }}
                            className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-gray-400 text-xs uppercase font-bold mb-1">Uptime</div>
                            <div className="text-2xl text-white font-display font-light">14d 2h</div>
                        </div>
                         <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-gray-400 text-xs uppercase font-bold mb-1">CPU Load</div>
                            <div className="text-2xl text-green-400 font-display font-light">12%</div>
                        </div>
                         <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-gray-400 text-xs uppercase font-bold mb-1">Proxies</div>
                            <div className="text-2xl text-blue-400 font-display font-light">Active</div>
                        </div>
                         <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-gray-400 text-xs uppercase font-bold mb-1">Queue</div>
                            <div className="text-xl text-white font-display font-light truncate">Processing</div>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                        <span>ScraperOS v2.4.0</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        DESKTOP IMPLEMENTATION: Original Sidebar 
        Visible only on medium screens and up
      */}
      <div 
        ref={containerRef}
        className="hidden md:block relative w-5/12 h-full bg-cover bg-center overflow-hidden z-40 transition-all duration-500"
        style={{ 
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCF5YhKqlqshk7uO300lFu7aftYGb2O1L-PrtV-4qTPvfZO9DKHgUD2WYwwjsIFphVpksZBWf7-BoS3gkWvkUdYlSayGVgcHjGRV9qDNNT3WN14Fo5U9jCQ1ApodtTGNxJPyh3xQpmSGvztXDcYB4kSb0tb9CYbfSw_llR_3avbVyTmd3fQB0qjDlg-dRqj01ndLCkC7CFle3YVhTM2Vtv_Y55lEr9TLDnAu5D2zYIa6VS0sP1MVBOtGmbsQE8eYELiLebG8I4Zm2I')" 
        }}
      >
        <div className="absolute inset-0 bg-accent-blue/40 dark:bg-blue-950/80 mix-blend-multiply transition-colors duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 dark:to-black/80"></div>
        
        <div className="absolute inset-0 p-8 flex flex-col items-stretch justify-between text-white z-10">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between w-auto">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-3xl text-white dark:text-neon-blue transition-colors">data_exploration</span>
              <h1 className="text-xl font-semibold tracking-wide select-none">Scraper<span className="font-light opacity-80">OS</span></h1>
            </div>
          </div>

          {/* Floating Status Card (Draggable) */}
          <div 
            ref={cardRef}
            onMouseDown={handleMouseDown}
            style={{ 
              transform: `translateY(${offsetY}px)`
            }}
            className={`
              absolute z-20 transition-all duration-300
              left-8 right-auto w-64 top-28 origin-top-left
              ${isDragging ? 'cursor-grabbing transition-none' : 'cursor-grab transition-transform duration-300'}
              ${showStatus ? 'pointer-events-auto' : 'pointer-events-none'}
            `}
          >
            <div className={`
              glass-panel relative text-white p-6 rounded-3xl shadow-2xl transition-all duration-500 ease-in-out 
              dark:border-white/10 dark:bg-slate-900/60 backdrop-blur-md
              ${showStatus ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
            `}>
              {/* Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium opacity-80 select-none">System Status</span>
                  <div className="flex items-center space-x-2 bg-yellow-400 dark:bg-neon-green/20 dark:border dark:border-neon-green/50 text-black dark:text-neon-green text-xs font-bold px-2 py-0.5 rounded-full transition-colors select-none">
                    <span className="w-1.5 h-1.5 bg-black dark:bg-neon-green rounded-full animate-pulse"></span>
                    <span>Running</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowStatus(false); }}
                  className="text-white/50 hover:text-white transition p-1 hover:bg-white/10 rounded-full flex items-center justify-center -mr-1"
                >
                  <span className="material-icons text-sm">close</span>
                </button>
              </div>

              <div className="space-y-3 text-sm select-none">
                <div className="flex justify-between items-center">
                  <span className="opacity-60">Uptime</span>
                  <span className="font-medium">14d 2h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60">CPU Load</span>
                  <span className="font-medium text-green-400 dark:text-neon-green">12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60">Proxies</span>
                  <span className="font-medium text-blue-300 dark:text-neon-blue">Active</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="opacity-60">Queue</span>
                  <span className="font-medium">Processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Title Area */}
          <div ref={bottomRef} className="mt-auto z-10">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-2 dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] select-none">
              Job Data <br /> Extraction
            </h2>
            <div className="flex items-center space-x-4 text-sm">
              <span className="opacity-70">Wed, 27th</span>
              <span className="w-1 h-1 bg-white rounded-full opacity-70"></span>
              
              {showStatus ? (
                <span className="text-green-400 dark:text-neon-green font-medium transition-opacity duration-300 opacity-100">Now Online</span>
              ) : (
                <button 
                  onClick={() => setShowStatus(true)}
                  className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all duration-300 animate-in fade-in slide-in-from-left-4 backdrop-blur-sm border border-white/10"
                >
                    <span className="w-2 h-2 bg-green-400 dark:bg-neon-green rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    <span className="text-green-400 dark:text-neon-green font-medium text-xs">System Online</span>
                    <span className="material-icons text-[12px] text-white/70 ml-1 group-hover:text-white transition-colors">visibility</span>
                </button>
              )}
            </div>
            
            {/* Navigation Controls */}
            <div className="mt-8 flex items-center space-x-4 opacity-50 hover:opacity-100 transition">
              <button className="p-1 border border-white/30 rounded-full hover:bg-white/10 transition">
                <span className="material-icons text-sm">chevron_left</span>
              </button>
              <div className="h-0.5 w-24 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-white dark:bg-neon-blue dark:shadow-[0_0_8px_#00f0ff]"></div>
              </div>
              <button className="p-1 border border-white/30 rounded-full hover:bg-white/10 transition">
                <span className="material-icons text-sm">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Visualizer */}
          <div className="absolute top-1/3 right-8 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center pointer-events-auto block">
              <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* TOOLTIPS / INFO PANEL */}
                  <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-xl text-xs text-white transition-all duration-300 z-50 pointer-events-none min-w-[140px] text-center ${activeNode ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                      {activeNode === 'source' && (
                          <div>
                              <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Data Sources</div>
                              <div className="flex items-center justify-center gap-2 text-blue-400 font-mono text-sm font-bold">
                                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                  3 Connected
                              </div>
                          </div>
                      )}
                      {activeNode === 'process' && (
                           <div>
                              <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Processing</div>
                              <div className="flex items-center justify-center gap-2 text-yellow-400 font-mono text-sm font-bold">
                                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                                  12 Threads
                              </div>
                          </div>
                      )}
                      {activeNode === 'db' && (
                           <div>
                              <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Database</div>
                              <div className="flex items-center justify-center gap-2 text-green-400 font-mono text-sm font-bold">
                                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                  124 rec/s
                              </div>
                          </div>
                      )}
                  </div>

                  <svg className="w-full h-full" viewBox="0 0 200 200">
                      <defs>
                          <filter id="glow">
                              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                              <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                          </filter>
                      </defs>

                      {/* SOURCE LAYER (Outer Ring) */}
                      <g className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: '100px 100px' }}>
                          <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" 
                              className={`transition-all duration-500 ${activeNode === 'source' ? 'text-blue-400/50 stroke-[1.5] drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-white/10 stroke-[1]'}`} 
                              strokeDasharray="4 4" 
                          />
                          <g className="transition-opacity">
                              <circle cx="100" cy="15" r="4" className={`transition-all duration-300 ${activeNode === 'source' ? 'fill-blue-400' : 'fill-blue-400/50'}`} filter={activeNode === 'source' ? "url(#glow)" : ""} />
                              <circle cx="100" cy="15" r="12" fill="transparent" />
                          </g>
                          <g>
                              <circle cx="173" cy="142" r="4" className={`transition-all duration-300 ${activeNode === 'source' ? 'fill-blue-400' : 'fill-blue-400/50'}`} filter={activeNode === 'source' ? "url(#glow)" : ""} />
                          </g>
                          <g>
                              <circle cx="27" cy="142" r="4" className={`transition-all duration-300 ${activeNode === 'source' ? 'fill-blue-400' : 'fill-blue-400/50'}`} filter={activeNode === 'source' ? "url(#glow)" : ""} />
                          </g>
                      </g>

                      {/* PROCESS LAYER (Middle Arcs) */}
                      <g className="animate-[spin_8s_linear_infinite_reverse]" style={{ transformOrigin: '100px 100px' }}>
                          <path d="M100 40 A 60 60 0 0 1 160 100" fill="none" stroke="currentColor" 
                              className={`transition-all duration-300 ${activeNode === 'process' ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-white/30'}`} 
                              strokeWidth="1.5" strokeLinecap="round" 
                          />
                          <path d="M100 160 A 60 60 0 0 1 40 100" fill="none" stroke="currentColor" 
                              className={`transition-all duration-300 ${activeNode === 'process' ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-white/30'}`} 
                              strokeWidth="1.5" strokeLinecap="round" 
                          />
                      </g>

                      {/* DATA FLOW PARTICLES */}
                      <style>{`
                          @keyframes flowIn {
                              0% { r: 1; opacity: 0; transform: translateY(-80px); }
                              20% { opacity: 1; }
                              80% { opacity: 1; }
                              100% { r: 2; opacity: 0; transform: translateY(-20px); }
                          }
                      `}</style>
                      <g style={{ transformOrigin: '100px 100px' }} className="animate-[spin_5s_linear_infinite]">
                          <circle cx="100" cy="100" r="2" fill="#39ff14" className="opacity-0" style={{ animation: 'flowIn 2s infinite ease-in' }} />
                      </g>
                      <g style={{ transformOrigin: '100px 100px' }} className="animate-[spin_7s_linear_infinite]">
                          <circle cx="100" cy="100" r="2" fill="#39ff14" className="opacity-0" style={{ animation: 'flowIn 3s infinite ease-in 1s', transform: 'rotate(120deg)' }} />
                      </g>
                       <g style={{ transformOrigin: '100px 100px' }} className="animate-[spin_6s_linear_infinite_reverse]">
                          <circle cx="100" cy="100" r="2" fill="#39ff14" className="opacity-0" style={{ animation: 'flowIn 2.5s infinite ease-in 0.5s', transform: 'rotate(240deg)' }} />
                      </g>

                      {/* DB LAYER (Center) */}
                      <g>
                          <circle cx="100" cy="100" r="20" fill="currentColor" className={`transition-colors duration-300 ${activeNode === 'db' ? 'text-green-500/20' : 'text-white/5'}`} />
                          <circle cx="100" cy="100" r="12" stroke="currentColor" className={`transition-colors duration-300 ${activeNode === 'db' ? 'text-green-400' : 'text-white/50'}`} strokeWidth="2" fill="none" />
                          <circle cx="100" cy="100" r="6" fill="currentColor" className={`transition-colors duration-300 ${activeNode === 'db' ? 'text-green-400' : 'text-white'}`} filter="url(#glow)">
                              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                          </circle>
                      </g>

                      {/* CONNECTIONS */}
                      <path d="M100 25 L100 40" stroke="currentColor" className="text-white/20" strokeWidth="1" />
                      <path d="M165 137 L152 130" stroke="currentColor" className="text-white/20" strokeWidth="1" />
                      <path d="M35 137 L48 130" stroke="currentColor" className="text-white/20" strokeWidth="1" />

                      {/* INTERACTION OVERLAYS (HIT AREAS) */}
                      <circle cx="100" cy="100" r="85" fill="none" stroke="transparent" strokeWidth="20" 
                          className="cursor-pointer hover:stroke-white/5 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setActiveNode(activeNode === 'source' ? null : 'source'); }}
                      >
                          <title>Source Nodes</title>
                      </circle>

                      <circle cx="100" cy="100" r="60" fill="none" stroke="transparent" strokeWidth="20" 
                          className="cursor-pointer hover:stroke-white/5 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setActiveNode(activeNode === 'process' ? null : 'process'); }}
                      >
                          <title>Processing Layer</title>
                      </circle>

                      <circle cx="100" cy="100" r="25" fill="transparent" 
                          className="cursor-pointer hover:fill-white/5 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setActiveNode(activeNode === 'db' ? null : 'db'); }}
                      >
                          <title>Database</title>
                      </circle>

                  </svg>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;