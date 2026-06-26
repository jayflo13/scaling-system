import React from 'react';

interface ActivityItem {
  id: string;
  type: 'reschedule' | 'booked' | 'suggest' | 'alert';
  title: string;
  highlight?: string;
  reason: string;
  time: string;
}

const ActivityFeed: React.FC<{ items: ActivityItem[] }> = ({ items }) => {
  const iconMap = {
    reschedule: { char: '↔️', bg: 'bg-[#FFF3E0]' },
    booked: { char: '🕐', bg: 'bg-[#E0F2F4]' },
    suggest: { char: '🛒', bg: 'bg-[#F0EDF8]' },
    alert: { char: '✈️', bg: 'bg-[#FFF8E1]' },
  };

  return (
    <ul className="list-none">
      {items.map((item, index) => (
        <li 
          key={item.id} 
          className="flex gap-3 py-3 border-bottom border-gray-100 last:border-0 animate-in fade-in slide-in-from-bottom-1 duration-300 fill-mode-both"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm flex-none mt-0.5 ${iconMap[item.type].bg}`}>
            {iconMap[item.type].char}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-gray-700 leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: item.title }} />
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
              <span className="text-gray-500">{item.reason}</span>
              <span>· {item.time}</span>
            </div>
          </div>
          <div className="flex gap-1 flex-none mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
             {item.type === 'suggest' || item.type === 'alert' ? (
               <>
                 <button className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#E0F2F4] text-[#0A7E8C] hover:bg-[#0A7E8C] hover:text-white transition-all cursor-pointer">
                   {item.type === 'suggest' ? 'Confirm' : 'Looks good'}
                 </button>
                 <button className="text-[11px] font-medium px-2.5 py-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">✕</button>
               </>
             ) : (
               <button className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer">Undo</button>
             )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActivityFeed;
