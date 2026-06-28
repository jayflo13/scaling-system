import React from 'react';

const MilestoneStreak: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 max-w-[320px]">
      <div className="p-8 text-center bg-gradient-to-br from-[#E0F2F4] to-[#B2DFDB] relative overflow-hidden">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#0A7E8C] mb-2">New Achievement</div>
        <div className="text-3xl mb-1.5">🔥</div>
        <div className="font-bold text-lg text-gray-800">High Confidence Streak</div>
        <div className="text-[11px] text-gray-500 mt-0.5">5 consecutive auto-syncs · 0 corrections</div>
        
        <div className="flex items-center justify-center gap-1.5 my-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_0_3px_#E6F7EC]"></div>
          ))}
        </div>
        
        <div className="text-[44px] font-extrabold text-[#0A7E8C] leading-none mb-1 tracking-tight">
          5 <span className="text-xl font-normal text-gray-400">days</span>
        </div>
        <div className="text-[11px] text-gray-500">Streak Duration</div>
        
        <div className="absolute bottom-2.5 right-3.5 text-[10px] text-[#0A7E8C] font-bold opacity-40">
          Simplifi ✦ AI
        </div>
      </div>
      
      <div className="px-5 py-3 border-b border-gray-100 text-[11px] text-gray-500">
        Auto-Decision Trust Level: <strong className="text-green-600">Escalated</strong>
      </div>
      
      <div className="p-4 flex gap-2 justify-center">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity">
          𝕏 Share
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#0A66C2] text-white hover:opacity-90 transition-opacity">
          in Share
        </button>
      </div>
    </div>
  );
};

export default MilestoneStreak;
