import React, { useState } from 'react';
import GlobalNavigation from '../components/GlobalNavigation';
import { GoogleGenAI, Type } from "@google/genai";

type ViewType = 'admin' | 'profile' | 'jobhunt' | 'outreach';

interface Props {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const UserProfileSetup: React.FC<Props> = ({ currentView, setCurrentView, darkMode, toggleTheme }) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("Alex Donovan");
  const [currentTitle, setCurrentTitle] = useState("Head of Growth");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState([
    "Led a team of 15 to achieve 200% YoY growth",
    "Closed $5M in enterprise deals in 2023",
    "Spoke at Global Sales Conference 2022"
  ]);

  // Education State
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");

  // Skills State
  const [skills, setSkills] = useState<string[]>(["Strategic Partnerships", "B2B Sales"]);
  const [skillInput, setSkillInput] = useState("");

  // AI Loading State
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Helper to manage skills
  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // 1. Generate Bio Only
  const generateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a professional, engaging, and slightly conversational bio (under 60 words) for ${fullName}, who is a ${currentTitle} with 10+ years of experience in B2B SaaS.`,
      });
      if (response.text) {
        setBio(response.text.trim());
      }
    } catch (error) {
      console.error("Error generating bio:", error);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // 2. Full Profile Extraction / Enhancement
  const enhanceProfile = async () => {
    if (!linkedInUrl) {
      alert("Please enter a valid LinkedIn URL");
      return;
    }

    setIsEnhancing(true);
    try {
      // Call our Backend Application API which handles the scraping
      const response = await fetch('http://localhost:8000/api/profile/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedin_url: linkedInUrl }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to fetch profile");
      }

      const data = await response.json();

      // Batch updates
      if (data.fullName) setFullName(data.fullName);
      if (data.currentTitle) setCurrentTitle(data.currentTitle);
      if (data.bio) setBio(data.bio);
      if (data.experience && Array.isArray(data.experience)) setExperience(data.experience);
      if (data.education) {
        if (data.education.degree) setDegree(data.education.degree);
        if (data.education.institution) setInstitution(data.education.institution);
      }
      if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);

    } catch (error) {
      console.error("Error enhancing profile:", error);
      alert(`Error fetching profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsEnhancing(false);
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
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary text-lg">badge</span>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Step 1 of 5</div>
                <div className="text-xs text-white font-bold leading-none">Personal Info</div>
              </div>
            </div>

            {/* Expanded Content */}
            <div className={`${mobileExpanded ? 'block' : 'hidden'} p-5`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">checklist</span>
                  Setup Progress
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); setMobileExpanded(false); }}
                  className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(74,222,128,0.4)]">
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-bold text-white">Personal Info</div>
                    <div className="text-xs text-green-400">Completed</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-[-20px] bottom-[-20px] w-0.5 bg-white/10 -z-10"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-glow animate-pulse border-2 border-orange-300">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-bold text-white">Professional Bio</div>
                      <div className="text-xs text-primary">In Progress</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
                    <span className="text-xs">3</span>
                  </div>
                  <div className="text-sm font-medium text-white">Qualifications</div>
                </div>

                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
                    <span className="text-xs">4</span>
                  </div>
                  <div className="text-sm font-medium text-white">Education</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar with Steps (Desktop Only) */}
      <div
        className="hidden md:block relative w-full md:w-3/12 lg:w-2/12 h-full bg-cover bg-center overflow-hidden group shrink-0 shadow-2xl z-20"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCF5YhKqlqshk7uO300lFu7aftYGb2O1L-PrtV-4qTPvfZO9DKHgUD2WYwwjsIFphVpksZBWf7-BoS3gkWvkUdYlSayGVgcHjGRV9qDNNT3WN14Fo5U9jCQ1ApodtTGNxJPyh3xQpmSGvztXDcYB4kSb0tb9CYbfSw_llR_3avbVyTmd3fQB0qjDlg-dRqj01ndLCkC7CFle3YVhTM2Vtv_Y55lEr9TLDnAu5D2zYIa6VS0sP1MVBOtGmbsQE8eYELiLebG8I4Zm2I')" }}
      >
        <div className="absolute inset-0 bg-accent-blue/40 dark:bg-blue-950/80 mix-blend-multiply transition-colors duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
          <div className="flex items-center justify-between md:justify-start md:space-x-3">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <span className="material-symbols-outlined text-2xl text-white dark:text-neon-blue">rocket_launch</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">Outreach<span className="font-light opacity-80">Bot</span></h1>
          </div>
          <div className="hidden md:block flex-grow mt-12 overflow-y-auto pr-2">
            <nav className="space-y-0">
              <div className="relative step-item pb-6">
                <div className="step-connector"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center border-2 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.4)]">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-white">Personal Info</span>
                    <span className="text-xs text-white/60">Completed</span>
                  </div>
                </div>
              </div>
              <div className="relative step-item pb-6">
                <div className="step-connector"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center border-2 border-orange-300 shadow-glow animate-pulse">
                    <span className="text-[10px] font-bold">2</span>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-white">Professional Bio</span>
                    <span className="text-xs text-white/80">In Progress</span>
                  </div>
                </div>
              </div>
              <div className="relative step-item pb-6">
                <div className="step-connector"></div>
                <div className="flex items-start gap-4 relative z-10 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
                    <span className="text-[10px]">3</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium">Qualifications</span>
                  </div>
                </div>
              </div>
              <div className="relative step-item pb-6">
                <div className="step-connector"></div>
                <div className="flex items-start gap-4 relative z-10 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
                    <span className="text-[10px]">4</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium">Education</span>
                  </div>
                </div>
              </div>
              <div className="relative step-item">
                <div className="flex items-start gap-4 relative z-10 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
                    <span className="text-[10px]">5</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium">Experience</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-9/12 lg:w-10/12 h-full overflow-y-auto bg-background-light dark:bg-background-dark transition-colors duration-300 relative flex flex-col pt-20 md:pt-0">

        {/* Sticky Header inside Main Area */}
        <GlobalNavigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />

        {/* Background Gradients */}
        <div className="fixed top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-orange-500/5 dark:bg-indigo-900/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Form Content */}
        <div className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto w-full pb-24">
          <form className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" onSubmit={(e) => e.preventDefault()}>
            <div className="lg:col-span-8 space-y-4">

              {/* Personal Info Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    <input
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 dark:text-white placeholder-gray-400"
                      placeholder="e.g. Alex Donovan"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Current Title</label>
                    <input
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 dark:text-white placeholder-gray-400"
                      placeholder="e.g. Head of Growth"
                      type="text"
                      value={currentTitle}
                      onChange={(e) => setCurrentTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">LinkedIn Profile URL</label>
                    <div className="flex gap-3">
                      <div className="relative group flex-grow">
                        <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors">link</span>
                        <input
                          className="w-full pl-11 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 dark:text-white placeholder-gray-400"
                          placeholder="https://linkedin.com/in/..."
                          type="url"
                          value={linkedInUrl}
                          onChange={(e) => setLinkedInUrl(e.target.value)}
                        />
                      </div>
                      <button
                        className={`shrink-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-medium text-sm rounded-xl px-4 py-3 shadow-lg shadow-purple-500/20 hover:shadow-blue-500/40 transition-all duration-300 transform ${isEnhancing ? 'opacity-80 cursor-wait' : 'hover:-translate-y-0.5 active:scale-95'}`}
                        type="button"
                        onClick={enhanceProfile}
                        disabled={isEnhancing}
                      >
                        {isEnhancing ? (
                          <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                        ) : (
                          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        )}
                        {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                      <span className="material-symbols-outlined">person_book</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Professional Bio</h3>
                  </div>
                  <button
                    className={`bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-size-200 hover:bg-right transition-all duration-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center gap-2 transform ${isGeneratingBio ? 'opacity-80 cursor-wait' : 'hover:-translate-y-0.5'}`}
                    type="button"
                    onClick={generateBio}
                    disabled={isGeneratingBio}
                  >
                    {isGeneratingBio ? (
                      <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    )}
                    {isGeneratingBio ? 'Writing...' : 'Generate with AI'}
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 ml-1">Provide a summary to define your bot's conversational tone.</p>
                  <textarea
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 dark:text-white placeholder-gray-400 min-h-[140px] resize-none leading-relaxed text-base"
                    placeholder="I am a seasoned Growth Executive with over 10 years of experience in B2B SaaS..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Qualifications Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Key Qualifications</h3>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Skills &amp; Certifications</label>
                  <div className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300 min-h-[50px] flex flex-wrap gap-2 items-center">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-lg text-sm font-medium shadow-sm border border-gray-200 dark:border-gray-600 flex items-center gap-2 animate-fadeIn">
                        {skill}
                        <button
                          className="hover:text-red-500 transition-colors ml-1 flex items-center"
                          type="button"
                          onClick={() => removeSkill(skill)}
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                    <input
                      className="bg-transparent outline-none flex-grow min-w-[120px] text-sm dark:text-white placeholder-gray-400"
                      placeholder="Type and press Enter..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                    />
                  </div>
                </div>
              </div>

              {/* Education Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Education</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Degree</label>
                    <input
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 dark:text-white placeholder-gray-400"
                      placeholder="e.g. MBA, Business Administration"
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Institution</label>
                    <input
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 dark:text-white placeholder-gray-400"
                      placeholder="e.g. Stanford University"
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Experience Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-400">
                    <span className="material-symbols-outlined">trophy</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Experience Highlights</h3>
                </div>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-700 group-focus-within:bg-primary group-focus-within:text-white transition-colors flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300 shadow-sm">{index + 1}</div>
                      <input
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 dark:text-white placeholder-gray-400"
                        placeholder={`Experience point ${index + 1}`}
                        type="text"
                        value={exp}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[index] = e.target.value;
                          setExperience(newExp);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sticky Sidebar - Profile Strength */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-white/60 dark:border-gray-700 relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-orange-400"></div>
                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Profile Strength</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Completion Status</p>
                  </div>
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                      <circle className="text-gray-100 dark:text-gray-700" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                      <circle className="text-primary dark:text-neon-blue" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset="70" strokeLinecap="round" strokeWidth="4"></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800 dark:text-white">60%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 mb-6 group hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      AI Persona Preview
                    </span>
                    <span className="material-symbols-outlined text-gray-400 text-sm">visibility</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <img alt="User Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATtMQohjgXjHE0b2xPeXAJTpjT-K8opfSnTXS3-w_nCbNLUfgkz9vMio-anAVQfItWshKM5_mVeEdtS8Njn-iEA65GLnih-qVL5ssYFXjBAFzucRascTjXyxsVMbhIrMX4YCepZmEQTy7TwZLdxoxoUEV3z73CwtjmUn2VyGoVGv9Nokewnid_vIcOkRATRCDRqx1WQru6aDN-mApBa7Tm8Y5hLBIBQoEJC82V_-Nq6YwcBF-rJmDkeWg9TGi7aWkODyO_3BsG0OE" />
                    <div>
                      <div className="text-sm font-bold text-gray-800 dark:text-white">{fullName}</div>
                      <div className="text-xs text-gray-500">{currentTitle}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 italic bg-white dark:bg-black/20 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50 min-h-[60px]">
                    {bio ? `"${bio.substring(0, 100)}..."` : '"Hi there! I\'m Alex, a Growth Exec focused on B2B SaaS..."'}
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full py-3.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transform active:scale-95 hover:-translate-y-0.5 transition-all" type="submit">
                    <span className="material-symbols-outlined">save</span>
                    Save Changes
                  </button>
                  <button className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm transition-colors" type="button">
                    Discard
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-600/90 to-purple-600/90 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl">auto_awesome</span>
                </div>
                <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                  Pro Tip
                </h4>
                <p className="text-xs opacity-90 leading-relaxed">
                  Adding "Strategic Partnerships" to your qualifications increases response rates by 12% in your industry sector.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSetup;