import React, { useState } from 'react';
import GlobalNavigation from '../components/GlobalNavigation';
import { supabase } from '../src/lib/supabase';


type ViewType = 'admin' | 'profile' | 'jobhunt' | 'outreach';

interface Props {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const JobHunterProfile: React.FC<Props> = ({ currentView, setCurrentView, darkMode, toggleTheme }) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActivateJobHunt = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('job_requests').insert({
        status: 'pending',
        preferences: {
          roles: ['VP of Engineering', 'Chief Technology Officer', 'Director of Engineering'],
          min_salary: 180000,
          max_salary: 350000,
          location: 'Remote',
          industry: 'FinTech',
          company_size: 'Growth (51-200)'
        }
      });

      if (error) throw error;

      alert('Job Hunt Activated! The backend worker will pick this up shortly.');
    } catch (err: any) {
      alert('Error starting job hunt: ' + err.message);
    } finally {
      setIsSubmitting(false);
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
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/20 relative">
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full absolute -top-0.5 -right-0.5 animate-pulse"></span>
                <span className="material-symbols-outlined text-orange-400 text-lg">rocket_launch</span>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Profile Setup</div>
                <div className="text-xs text-white font-bold leading-none">Pending</div>
              </div>
            </div>

            {/* Expanded Content */}
            <div className={`${mobileExpanded ? 'block' : 'hidden'} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-400">rocket_launch</span>
                  Setup Progress
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); setMobileExpanded(false); }}
                  className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 mb-4 bg-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Step 1 of 4</span>
                  <span className="text-xs text-orange-400 font-bold bg-orange-500/20 px-2 py-0.5 rounded-full">Pending</span>
                </div>
                <div className="text-white font-bold text-lg mb-1">Define Roles</div>
                <p className="text-xs text-gray-400 mb-3">Target job titles and preferences</p>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded-full w-1/4 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">AI Matching Engine</p>
                <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-bold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Ready v2.4.0
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
                <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Setup Progress</span>
                <div className="flex items-center space-x-2 bg-orange-500/20 border border-orange-400/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span>Pending</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold leading-tight mb-1">Profile Setup</h2>
              <p className="text-sm opacity-60 mb-4">Define your ideal role</p>
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="text-[10px] opacity-70 text-right">Step 1 of 4</div>
            </div>
            <div className="text-xs opacity-50 text-center">
              AI matching engine ready • V2.4.0
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
        <div className="p-4 md:p-8 space-y-6 relative z-10 max-w-5xl mx-auto w-full pb-24 mt-2">
          <form action="#" className="space-y-6" onSubmit={(e) => e.preventDefault()}>

            {/* Target Roles */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary dark:text-primary">badge</span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Target Roles</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Enter the job titles you want the bot to hunt for. Be specific for better results.</p>
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:ring-2 ring-primary/30 transition-shadow">
                <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm border border-gray-100 dark:border-gray-600 flex items-center gap-2 animate-fadeIn">
                  VP of Engineering <button className="hover:text-primary transition-colors flex items-center" type="button"><span className="material-symbols-outlined text-base">close</span></button>
                </span>
                <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm border border-gray-100 dark:border-gray-600 flex items-center gap-2 animate-fadeIn">
                  Chief Technology Officer <button className="hover:text-primary transition-colors flex items-center" type="button"><span className="material-symbols-outlined text-base">close</span></button>
                </span>
                <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm border border-gray-100 dark:border-gray-600 flex items-center gap-2 animate-fadeIn">
                  Director of Engineering <button className="hover:text-primary transition-colors flex items-center" type="button"><span className="material-symbols-outlined text-base">close</span></button>
                </span>
                <input className="bg-transparent border-none focus:ring-0 p-0 text-sm flex-grow min-w-[150px] text-gray-700 dark:text-white placeholder-gray-400 outline-none" placeholder="Type a title and press Enter..." type="text" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-blue">location_on</span>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Location</h3>
                  </div>
                  <label className="flex items-center cursor-pointer relative">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Remote Only</span>
                  </label>
                </div>
                <div className="space-y-4 flex-grow">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Preferred Cities / Timezones</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                      <input className="pl-10 w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 text-sm focus:border-primary focus:ring-primary dark:text-white outline-none py-2" placeholder="e.g. San Francisco, EST, GMT+1" type="text" />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      USA <button className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none" type="button">×</button>
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Canada <button className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none" type="button">×</button>
                    </span>
                  </div>
                </div>
              </div>

              {/* Compensation Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-green-500">payments</span>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Compensation</h3>
                </div>
                <div className="px-2 space-y-6 flex-grow flex flex-col justify-center">
                  <div className="relative pt-6 pb-2">
                    <div className="absolute -top-1 left-0 text-sm font-bold text-gray-600 dark:text-gray-300">$180k</div>
                    <div className="absolute -top-1 right-0 text-sm font-bold text-gray-600 dark:text-gray-300">$350k+</div>
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="absolute left-[20%] right-[10%] top-0 bottom-0 bg-gradient-to-r from-primary to-orange-400 rounded-full opacity-80"></div>
                      <div className="absolute left-[20%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-gray-200 border-2 border-primary rounded-full shadow-md cursor-grab hover:scale-110 transition-transform z-10"></div>
                      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-white dark:bg-gray-200 border-2 border-primary rounded-full shadow-md cursor-grab hover:scale-110 transition-transform z-10"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min Base Salary</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400">$</span>
                        <input className="pl-6 w-full rounded-lg border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 text-sm font-mono dark:text-white outline-none py-2" type="number" defaultValue="180000" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max Base Salary</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400">$</span>
                        <input className="pl-6 w-full rounded-lg border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 text-sm font-mono dark:text-white outline-none py-2" type="number" defaultValue="350000" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-purple-500">tune</span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Advanced Filters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Industry</label>
                  <select className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 text-sm focus:border-primary focus:ring-primary dark:text-white py-2 px-3 outline-none">
                    <option>Any Industry</option>
                    <option selected>FinTech</option>
                    <option>SaaS</option>
                    <option>Healthcare</option>
                    <option>E-commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Company Size</label>
                  <select className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 text-sm focus:border-primary focus:ring-primary dark:text-white py-2 px-3 outline-none">
                    <option>Any Size</option>
                    <option>Seed (1-10)</option>
                    <option>Series A (11-50)</option>
                    <option selected>Growth (51-200)</option>
                    <option>Enterprise (500+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Source Platforms</label>
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 dark:border-gray-600" type="checkbox" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        LinkedIn <span className="text-xs bg-blue-100 text-blue-800 px-1.5 rounded dark:bg-blue-900 dark:text-blue-200">Recommended</span>
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 dark:border-gray-600" type="checkbox" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Indeed</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input className="rounded border-gray-300 text-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 dark:border-gray-600" type="checkbox" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Glassdoor</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Persona Tone */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary dark:text-neon-blue">psychology</span>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">AI Persona Tone</h3>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Model: GPT-4o</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="cursor-pointer relative group">
                  <input defaultChecked className="peer sr-only" name="tone" type="radio" />
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 peer-checked:border-primary peer-checked:bg-orange-50 dark:peer-checked:bg-primary/10 peer-checked:ring-1 peer-checked:ring-primary transition-all h-full hover:border-primary/50">
                    <div className="flex items-center gap-2 mb-2 text-gray-800 dark:text-white font-bold group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">business_center</span> Professional
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Formal, respectful, and detailed. Best for C-suite and Enterprise outreach.
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 text-primary opacity-0 peer-checked:opacity-100 transition-opacity transform scale-0 peer-checked:scale-100">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                </label>
                <label className="cursor-pointer relative group">
                  <input className="peer sr-only" name="tone" type="radio" />
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 peer-checked:border-primary peer-checked:bg-orange-50 dark:peer-checked:bg-primary/10 peer-checked:ring-1 peer-checked:ring-primary transition-all h-full hover:border-primary/50">
                    <div className="flex items-center gap-2 mb-2 text-gray-800 dark:text-white font-bold group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">coffee</span> Casual
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Friendly, conversational, and light. Good for startups and creative roles.
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 text-primary opacity-0 peer-checked:opacity-100 transition-opacity transform scale-0 peer-checked:scale-100">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                </label>
                <label className="cursor-pointer relative group">
                  <input className="peer sr-only" name="tone" type="radio" />
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 peer-checked:border-primary peer-checked:bg-orange-50 dark:peer-checked:bg-primary/10 peer-checked:ring-1 peer-checked:ring-primary transition-all h-full hover:border-primary/50">
                    <div className="flex items-center gap-2 mb-2 text-gray-800 dark:text-white font-bold group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">bolt</span> Direct
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Concise, value-focused, and straight to the point. High efficiency.
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 text-primary opacity-0 peer-checked:opacity-100 transition-opacity transform scale-0 peer-checked:scale-100">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
              <button className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                Save as Draft
              </button>
              <button
                onClick={handleActivateJobHunt}
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl bg-primary hover:bg-orange-600 text-white font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className="material-symbols-outlined">{isSubmitting ? 'hourglass_top' : 'rocket_launch'}</span>
                {isSubmitting ? 'Starting...' : 'Activate Job Hunt'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default JobHunterProfile;