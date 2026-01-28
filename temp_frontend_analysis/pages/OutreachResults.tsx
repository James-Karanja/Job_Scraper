import React, { useState } from 'react';
import GlobalNavigation from '../components/GlobalNavigation';
import { GoogleGenAI } from "@google/genai";

type ViewType = 'admin' | 'profile' | 'jobhunt' | 'outreach';

interface Props {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const OutreachResults: React.FC<Props> = ({ currentView, setCurrentView, darkMode, toggleTheme }) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [emailContent, setEmailContent] = useState(`Hi [Name],\nI noticed you're scaling the engineering team at Stripe. Given your focus on high-availability payment infrastructure, I thought my background leading the 150-person engineering org at FintechFlow might be relevant.\nWould you be open to a brief chat about your vision for the platform?`);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const jobSnippet = "...seeking a visionary VP of Engineering to lead our global payments infrastructure team. The ideal candidate has experience scaling teams from 50 to 200+ engineers and a deep understanding of fintech regulations.";

  const handleRegenerateEmail = async () => {
    setIsRegenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a concise, professional cold outreach email to a hiring manager based on this job snippet: "${jobSnippet}". My name is Alex Donovan, a Head of Growth with technical experience. Mention relevant experience scaling teams. Keep it under 80 words.`,
      });
      if (response.text) {
        setEmailContent(response.text.trim());
      }
    } catch (error) {
      console.error("Error generating email:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-background-light dark:bg-background-dark font-display antialiased overflow-hidden transition-colors duration-300">
      
      {/* MOBILE FLOATING WIDGET */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${mobileExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMobileExpanded(false)}
        />
        
        {/* Floating Pill */}
        <div className={`fixed z-50 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${mobileExpanded ? 'bottom-0 left-0 right-0 p-4' : 'bottom-6 right-6'}`}>
          <div 
            onClick={() => !mobileExpanded && setMobileExpanded(true)}
            className={`
                bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden
                ${mobileExpanded ? 'rounded-3xl w-full' : 'rounded-full h-14 pl-2 pr-6 flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95'}
            `}
          >
            {/* Collapsed Content */}
            <div className={`flex items-center gap-3 ${mobileExpanded ? 'hidden' : 'flex'}`}>
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/20 relative">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse absolute"></span>
                    <span className="material-symbols-outlined text-green-400 text-lg">radar</span>
                </div>
                <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Campaign</div>
                    <div className="text-xs text-white font-bold leading-none">Active</div>
                </div>
            </div>

            {/* Expanded Content */}
            <div className={`${mobileExpanded ? 'block' : 'hidden'} p-5`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400">radar</span>
                        Campaign Status
                    </h3>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setMobileExpanded(false); }}
                        className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>
                
                <div className="glass-panel p-4 rounded-xl border border-white/10 mb-4 bg-white/5">
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-white font-bold text-lg">Executive Hunt</div>
                        <div className="bg-green-500/20 border border-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                             <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                             ACTIVE
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">Targeting CTOs in FinTech</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-white/10 rounded-lg p-2.5">
                            <div className="text-xl font-bold text-white">24</div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold">New Leads</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2.5">
                            <div className="text-xl font-bold text-primary dark:text-neon-blue">12</div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold">Ready</div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Next Auto-Scrape Run</div>
                    <div className="flex items-center justify-center gap-2 text-white text-xs font-mono font-bold bg-white/5 inline-block px-3 py-1 rounded-lg">
                        14:00 Today
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar (Desktop Only) */}
      <div 
        className="hidden md:block relative w-full md:w-3/12 h-full bg-cover bg-center overflow-hidden group shrink-0" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCF5YhKqlqshk7uO300lFu7aftYGb2O1L-PrtV-4qTPvfZO9DKHgUD2WYwwjsIFphVpksZBWf7-BoS3gkWvkUdYlSayGVgcHjGRV9qDNNT3WN14Fo5U9jCQ1ApodtTGNxJPyh3xQpmSGvztXDcYB4kSb0tb9CYbfSw_llR_3avbVyTmd3fQB0qjDlg-dRqj01ndLCkC7CFle3YVhTM2Vtv_Y55lEr9TLDnAu5D2zYIa6VS0sP1MVBOtGmbsQE8eYELiLebG8I4Zm2I')" }}
      >
        <div className="absolute inset-0 bg-accent-blue/40 dark:bg-blue-950/80 mix-blend-multiply transition-colors duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 dark:to-black/80"></div>
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-3xl text-white dark:text-neon-blue transition-colors">rocket_launch</span>
              <h1 className="text-xl font-semibold tracking-wide">Outreach<span className="font-light opacity-80">Bot</span></h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="glass-panel text-white p-5 rounded-2xl shadow-xl border border-white/10 dark:bg-slate-900/60 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Campaign Status</span>
                <div className="flex items-center space-x-2 bg-green-500/20 border border-green-400/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Active</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold leading-tight mb-1">Executive Hunt</h2>
              <p className="text-sm opacity-60 mb-4">Targeting CTOs in FinTech</p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xl font-bold">24</div>
                  <div className="text-[10px] opacity-70 uppercase">New Leads</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xl font-bold text-primary dark:text-neon-blue">12</div>
                  <div className="text-[10px] opacity-70 uppercase">Ready</div>
                </div>
              </div>
            </div>
            <div className="text-xs opacity-50 text-center">
              Auto-scraping enabled • Next run 14:00
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-9/12 h-full overflow-y-auto bg-background-light dark:bg-background-dark transition-colors duration-300 relative flex flex-col pt-20 md:pt-0">
        
        {/* Sticky Header inside Main Area */}
        <GlobalNavigation 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
        />

        {/* Ambient Background */}
        <div className="fixed top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0 hidden dark:block">
          <div className="absolute -top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-indigo-900/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 relative z-10 max-w-7xl mx-auto w-full mt-2">
          
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Location</span>
                <div className="bg-gray-100 dark:bg-slate-900 p-1 rounded-xl flex items-center border border-gray-200 dark:border-gray-600">
                  <button className="px-4 py-1.5 bg-white dark:bg-gray-600 rounded-lg shadow-sm text-xs font-bold text-gray-800 dark:text-white transition-all ring-1 ring-black/5 dark:ring-white/10">All</button>
                  <button className="px-4 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Remote Only</button>
                  <button className="px-4 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">On-site</button>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Salary</span>
                <div className="relative w-full sm:w-48 group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-lg group-hover:text-primary transition-colors">attach_money</span>
                  </div>
                  <select className="appearance-none w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
                    <option>Any Range</option>
                    <option>$100k+</option>
                    <option>$150k+</option>
                    <option>$200k+</option>
                    <option>$250k+</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-gray-400 pointer-events-none text-sm">expand_more</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end w-full xl:w-auto">
              <button className="text-xs font-bold text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-neon-blue transition-colors flex items-center gap-1 group py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-base group-hover:rotate-90 transition-transform">restart_alt</span>
                Clear All
              </button>
            </div>
          </div>

          {/* Results Stats & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <button className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium shadow-lg shadow-primary/20 hover:bg-orange-600 transition">All Results (12)</button>
              <button className="px-4 py-1.5 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">New (8)</button>
              <button className="px-4 py-1.5 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">Sent (4)</button>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="mr-2">Sort by:</span>
              <button className="flex items-center font-medium text-text-light dark:text-text-dark hover:text-primary transition">
                Relevance <span className="material-symbols-outlined text-lg ml-1">expand_more</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Card 1: Expanded View */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-l-4 border-l-primary border-y border-r border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
              <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4 lg:w-1/3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white leading-tight">VP of Engineering</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Stripe • <span className="text-gray-400 font-normal">San Francisco, CA</span></p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:gap-6 lg:w-1/3 lg:justify-center">
                  <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 text-xs font-semibold border border-green-200 dark:border-green-500/20">Remote</span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                    <img alt="LI" className="w-4 h-4 grayscale opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-1wHAWaC4gW1hT8y5AjnwrHO_eSzW5ESpNMmyj_9SSLBfZMSse-HvxHCeQlqHLYkQ1VUEy497PVNt0yviWiobaveSd4NmBLIRgif62yFNBMuw7-jxIsUt5jPL3uL2T5CuCXJ85_4fCurT3FghY0FhBOiZn2XUNDcUvrsd2MiOGANID0p-FIktC_d5oswK2_7ZTTVRwKN2MYuM_zfxZQSeYpLuaDdlVAmAMZtpwjLXY5KgRC_K8w2Pw9KAism4noV96wF9Y3_vry0" />
                    <span>LinkedIn</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-neon-blue/10 dark:text-neon-blue text-xs font-bold border border-blue-100 dark:border-neon-blue/20">New Lead</span>
                </div>
                <div className="lg:w-1/3 flex justify-end">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-4">
                    <span className="material-symbols-outlined">expand_less</span>
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-6 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Job Snippet</h4>
                      <button className="text-xs text-primary hover:underline">View Full Job</button>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 leading-relaxed h-48 overflow-y-auto custom-scrollbar">
                      <p className="mb-2">...seeking a visionary VP of Engineering to lead our global payments infrastructure team. The ideal candidate has experience scaling teams from 50 to 200+ engineers and a deep understanding of fintech regulations.</p>
                      <p><strong>Key Requirements:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-1 opacity-80">
                        <li>10+ years engineering management</li>
                        <li>Experience with high-availability systems</li>
                        <li>Strong recruitment track record</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent-blue dark:text-neon-blue">AI Generated Outreach</h4>
                      <div className="flex gap-2">
                        <button 
                            className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 transition ${isRegenerating ? 'animate-spin text-primary' : ''}`} 
                            title="Regenerate"
                            onClick={handleRegenerateEmail}
                            disabled={isRegenerating}
                        >
                          <span className="material-symbols-outlined text-sm">autorenew</span>
                        </button>
                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 transition" title="Edit">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-accent-blue/30 dark:border-neon-blue/30 shadow-sm relative group h-48">
                      <textarea 
                        className="w-full h-full bg-transparent border-none p-0 text-sm text-gray-700 dark:text-gray-200 resize-none focus:ring-0 leading-relaxed font-sans outline-none" 
                        spellCheck="false" 
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center mt-6 gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Skip Candidate</button>
                  <button className="px-6 py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-primary/30 flex items-center gap-2 transform active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-lg">send</span>
                    Send Email
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Collapsed View */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 justify-between hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 lg:w-1/3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white leading-tight">Chief Technology Officer</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Acme Corp • <span className="text-gray-400 font-normal">New York, NY</span></p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:gap-6 lg:w-1/3 lg:justify-center">
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold">On-site</span>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                  <span className="font-serif font-bold text-blue-700 dark:text-blue-400">In</span>
                  <span>Indeed</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-neon-blue/10 dark:text-neon-blue text-xs font-bold border border-blue-100 dark:border-neon-blue/20">New Lead</span>
              </div>
              <div className="lg:w-1/3 flex justify-end">
                <button className="px-5 py-2 rounded-xl bg-white dark:bg-transparent border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white dark:hover:bg-primary/20 dark:hover:text-white transition-colors shadow-sm">
                  Review &amp; Send
                </button>
              </div>
            </div>

            {/* Card 3: Collapsed View */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 lg:w-1/3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xl">
                  G
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white leading-tight">Director of Product</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">GlobalStream • <span className="text-gray-400 font-normal">Remote (EU)</span></p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:gap-6 lg:w-1/3 lg:justify-center">
                <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 text-xs font-semibold border border-green-200 dark:border-green-500/20">Remote</span>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                  <img alt="LI" className="w-4 h-4 grayscale opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkNn7ckOsCSIxNg49nilOvNbJFoTs-FVTKezepZxbKCBn9G_Q35y4xFDwdbmWNAcIIn0WCkMCX2dkLtXGyRc5CTsgXjv3eGW5IBz9Y6TL9ivLeP8VGiXNYltxOY_rsb969El4mQTtLTLcm3cel0S-kt4V9fOkia49NoFrFiiAAnFpCfAZXxXC_tzH9KWy9tkQHwXCKsuRXniXa70RKWJ5bwX1xo1ArVB2GgZ55NIA-P_LzCQGQEZJ9Y8iA3nLx31eSlDKgreBg9bE" />
                  <span>LinkedIn</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-xs font-medium border border-gray-200 dark:border-gray-700">Draft</span>
              </div>
              <div className="lg:w-1/3 flex justify-end">
                <button className="px-5 py-2 rounded-xl bg-white dark:bg-transparent border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:border-primary hover:text-primary dark:hover:border-neon-blue dark:hover:text-neon-blue transition-colors shadow-sm">
                  Continue Draft
                </button>
              </div>
            </div>

            {/* Card 4: Faded */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 justify-between opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4 lg:w-1/3">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center font-bold text-xl">
                  <span className="material-symbols-outlined">domain</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white leading-tight">Head of Sales</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Unknown Tech • <span className="text-gray-400 font-normal">Austin, TX</span></p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:gap-6 lg:w-1/3 lg:justify-center">
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold">Hybrid</span>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                  <span className="material-symbols-outlined text-sm">public</span>
                  <span>Web</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">Sent</span>
              </div>
              <div className="lg:w-1/3 flex justify-end">
                <button className="text-gray-400 hover:text-primary text-sm font-medium flex items-center gap-1 transition-colors">
                  View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-8 space-x-2">
            <button className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary transition shadow-sm">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-sm font-bold shadow-md shadow-primary/30">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition">3</button>
            <button className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary transition shadow-sm">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OutreachResults;