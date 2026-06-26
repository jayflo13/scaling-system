import React from 'react';

interface SidebarProps {
  userName: string;
  plan: string;
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userName, plan, currentScreen, onScreenChange }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen z-10 p-6 flex-none">
      <div className="flex items-center gap-2.5 px-2 mb-7">
        <div className="w-8.5 h-8.5 bg-linear-to-br from-[#0A7E8C] to-[#075B66] rounded-lg flex items-center justify-center text-white text-lg shadow-[0_2px_8px_rgba(10,126,140,0.25)] flex-none">
          ✦
        </div>
        <div className="text-xl font-semibold text-gray-900 tracking-tight">
          Simplifi <span className="text-[#0A7E8C] font-light">AI</span>
        </div>
      </div>

      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2 mt-1">Main</div>
      <nav className="flex flex-col gap-0.5 flex-1">
        <button 
          onClick={() => onScreenChange('dashboard')} 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold relative transition-all text-left cursor-pointer ${
            currentScreen === 'dashboard' ? 'bg-[#E0F2F4] text-[#0A7E8C]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          <span className="text-base flex-none">📊</span>
          Daily Brief
          {currentScreen === 'dashboard' && <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#0A7E8C] rounded-r-sm"></div>}
        </button>
        <button 
          onClick={() => onScreenChange('calendar')} 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold relative transition-all text-left cursor-pointer ${
            currentScreen === 'calendar' ? 'bg-[#E0F2F4] text-[#0A7E8C]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          <span className="text-base flex-none">📅</span>
          Calendar
          <span className="ml-auto bg-[#E0F2F4] text-[#0A7E8C] text-[10px] font-semibold px-2 py-0.5 rounded-full">3</span>
          {currentScreen === 'calendar' && <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#0A7E8C] rounded-r-sm"></div>}
        </button>
        <button 
          onClick={() => onScreenChange('activity')} 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold relative transition-all text-left cursor-pointer ${
            currentScreen === 'activity' ? 'bg-[#E0F2F4] text-[#0A7E8C]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          <span className="text-base flex-none">🤖</span>
          Activity Log
          {currentScreen === 'activity' && <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#0A7E8C] rounded-r-sm"></div>}
        </button>
        
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2 mt-4">Settings</div>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all text-left cursor-pointer">
          <span className="text-base flex-none">⚙️</span>
          Preferences
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all text-left cursor-pointer">
          <span className="text-base flex-none">🔗</span>
          Integrations
          <span className="ml-auto bg-[#E0F2F4] text-[#0A7E8C] text-[10px] font-semibold px-2 py-0.5 rounded-full">2</span>
        </button>
      </nav>

      <div className="border-t border-gray-100 pt-3 mt-auto">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
          <div className="w-8.5 h-8.5 rounded-full bg-linear-to-br from-[#7C6FBA] to-[#9B8FD4] text-white flex items-center justify-center text-xs font-semibold flex-none">
            {userName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-gray-800 truncate">{userName}</div>
            <div className="text-[11px] text-gray-500 truncate">✦ {plan}</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#38A169] shadow-[0_0_0_2px_white]" title="Connected"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
