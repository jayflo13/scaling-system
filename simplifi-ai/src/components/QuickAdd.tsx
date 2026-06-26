import React from 'react';

const QuickAdd: React.FC = () => {
  const suggestions = [
    '🏋️ 30 min workout',
    '📋 Grocery run',
    '🧘 20 min meditation',
    '📞 Call mom',
    '💊 Pick up prescription',
    '📖 Read 20 pages'
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
      <div className="p-5">
        <div className="flex gap-2.5">
          <input 
            type="text" 
            placeholder='Try: "45 min gym tomorrow afternoon" or "pick up dry cleaning on Friday"' 
            className="flex-1 px-4 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A7E8C] focus:shadow-[0_0_0_3px_rgba(10,126,140,0.08)] transition-all text-gray-800 placeholder:text-gray-400"
          />
          <button className="bg-[#0A7E8C] text-white px-4.5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#075B66] hover:shadow-[0_4px_12px_rgba(10,126,140,0.25)] transition-all whitespace-nowrap cursor-pointer">
            ✦ Auto-Schedule
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap mt-3">
          {suggestions.map((s) => (
            <button key={s} className="px-3 py-1.5 border border-gray-200 rounded-full text-[12px] font-medium text-gray-600 bg-white hover:border-[#0A7E8C] hover:bg-[#E0F2F4] hover:text-[#0A7E8C] transition-all cursor-pointer">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAdd;
