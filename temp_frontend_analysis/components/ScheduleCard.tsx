import React, { useState, useEffect, useRef } from 'react';

// Mock database of timezones
const CITIES = [
  { id: 'nbo', city: 'Nairobi', country: 'Kenya', offset: '+3', label: 'GMT(+3)' },
  { id: 'nyc', city: 'New York', country: 'USA', offset: '-5', label: 'GMT(-5)' },
  { id: 'ldn', city: 'London', country: 'UK', offset: '+0', label: 'GMT(+0)' },
  { id: 'tyo', city: 'Tokyo', country: 'Japan', offset: '+9', label: 'GMT(+9)' },
  { id: 'dxb', city: 'Dubai', country: 'UAE', offset: '+4', label: 'GMT(+4)' },
  { id: 'syd', city: 'Sydney', country: 'Australia', offset: '+11', label: 'GMT(+11)' },
  { id: 'lax', city: 'Los Angeles', country: 'USA', offset: '-8', label: 'GMT(-8)' },
  { id: 'ber', city: 'Berlin', country: 'Germany', offset: '+1', label: 'GMT(+1)' },
  { id: 'par', city: 'Paris', country: 'France', offset: '+1', label: 'GMT(+1)' },
  { id: 'sin', city: 'Singapore', country: 'Singapore', offset: '+8', label: 'GMT(+8)' },
];

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const ScheduleCard: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Schedule Settings State
  const [time, setTime] = useState('04:30');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri
  const [selectedZone, setSelectedZone] = useState(CITIES[0]); 
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = CITIES.filter(c => 
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index].sort());
    }
  };

  const handleCitySelect = (city: typeof CITIES[0]) => {
    setSelectedZone(city);
    setSearchQuery('');
    setShowDropdown(false);
  };

  // UI Helpers
  const formatDays = () => {
    if (frequency === 'daily') return 'Every day';
    if (selectedDays.length === 0) return 'Never';
    if (selectedDays.length === 7) return 'Every day';
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return selectedDays.map(d => dayNames[d]).join(', ');
  };

  if (isEditing) {
    return (
      <div className="bg-panel-light dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border-white/10 p-6 rounded-DEFAULT shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between transition-all duration-300 min-h-[320px]">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Edit Schedule</h4>
            <button 
              onClick={() => setIsEditing(false)} 
              className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              Done
            </button>
          </div>

          <div className="space-y-4">
            {/* Timezone Search */}
            <div className="relative" ref={searchRef}>
              <label className="text-xs text-gray-400 mb-1 block">Timezone</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder={`${selectedZone.city}, ${selectedZone.country}`}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 dark:text-white"
                />
                {!searchQuery && (
                  <span className="absolute right-3 top-2 text-xs text-gray-500 mt-0.5 pointer-events-none opacity-60">
                    {selectedZone.label}
                  </span>
                )}
              </div>
              
              {showDropdown && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredCities.length > 0 ? filteredCities.map(city => (
                    <div 
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-sm flex justify-between items-center border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                    >
                      <span className="text-text-light dark:text-text-dark">{city.city}, <span className="text-gray-400">{city.country}</span></span>
                      <span className="text-xs text-primary font-mono bg-primary/5 px-1.5 py-0.5 rounded">{city.label}</span>
                    </div>
                  )) : (
                    <div className="px-3 py-2 text-xs text-gray-400">No cities found</div>
                  )}
                </div>
              )}
            </div>

            {/* Time Picker */}
            <div>
               <label className="text-xs text-gray-400 mb-1 block">Run Time</label>
               <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-lg font-mono focus:ring-2 focus:ring-primary outline-none dark:[color-scheme:dark] text-text-light dark:text-text-dark"
              />
            </div>

            {/* Frequency Toggle */}
            <div className="flex bg-gray-100 dark:bg-black/40 p-1 rounded-lg">
              <button 
                onClick={() => setFrequency('daily')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${frequency === 'daily' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Daily
              </button>
              <button 
                onClick={() => setFrequency('weekly')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${frequency === 'weekly' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Weekly
              </button>
            </div>

            {/* Days Selector */}
            <div className={`overflow-hidden transition-all duration-300 ${frequency === 'weekly' ? 'max-h-24 opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
              <div className="flex justify-between px-1">
                {DAYS.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(i)}
                    className={`w-8 h-8 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                      selectedDays.includes(i) 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-panel-light dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border-white/10 p-6 rounded-DEFAULT shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between transition-all duration-300 min-h-[280px] relative group hover:shadow-md">
      
      {/* Edit Button */}
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-primary transition-all rounded-full hover:bg-primary/10 opacity-0 group-hover:opacity-100"
        title="Edit Schedule"
      >
        <span className="material-icons text-sm">edit</span>
      </button>

      <div>
        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">Schedule Settings</h4>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className={`text-4xl font-light transition-colors duration-300 ${enabled ? 'text-text-light dark:text-text-dark' : 'text-gray-400 dark:text-gray-600'}`}>
              {time}
            </span>
            <div className="flex items-center mt-1">
               <span className="text-xs text-primary font-bold uppercase tracking-wider mr-1">{selectedZone.city}</span>
               <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{selectedZone.label}</span>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={enabled} 
              onChange={() => setEnabled(!enabled)} 
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary transition-colors"></div>
          </label>
        </div>
        
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-6 truncate max-w-[90%] bg-gray-50 dark:bg-white/5 py-1.5 px-3 rounded-lg inline-block border border-gray-100 dark:border-white/5">
          <span className="material-icons text-[12px] align-middle mr-1 opacity-70">event</span>
          {formatDays()}
        </div>
      </div>
      
      <div className={`space-y-4 transition-opacity duration-300 ${enabled ? 'opacity-100' : 'opacity-50 grayscale'}`}>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-xs text-gray-400 dark:text-gray-400">Next run in</div>
            <div className="text-xs font-semibold inline-block text-primary dark:text-primary">
              {enabled ? "4h 12m" : "Paused"}
            </div>
          </div>
          <div className="overflow-hidden h-1.5 mb-1 text-xs flex rounded bg-primary/10 dark:bg-gray-700">
            <div 
              style={{ width: "65%" }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;