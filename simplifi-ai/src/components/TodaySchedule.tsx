import React from 'react';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  meta: string;
  type: 'meeting' | 'focus' | 'personal' | 'health';
  status: 'manual' | 'ai' | 'pending' | 'done';
}

const TodaySchedule: React.FC<{ items: ScheduleItem[] }> = ({ items }) => {
  const dotColors = {
    meeting: 'bg-[#0A7E8C]',
    focus: 'bg-[#F0A040]',
    personal: 'bg-[#7C6FBA]',
    health: 'bg-[#38A169]',
  };

  const badgeStyles = {
    manual: 'bg-gray-100 text-gray-500',
    ai: 'bg-[#E0F2F4] text-[#0A7E8C]',
    pending: 'bg-[#FEF3E4] text-[#0A7E8C]', // Adjusted to match mockup's primary-dark look
    done: 'bg-gray-100 text-gray-400',
  };

  return (
    <ul className="list-none">
      {items.map((item, index) => (
        <li 
          key={item.id} 
          className={`flex items-start gap-3 py-2 px-1 rounded-lg transition-all group ${
            item.status === 'ai' ? 'bg-[#E0F2F4] px-3 my-1 border-0' : 
            item.status === 'pending' ? 'border-[1.5px] border-dashed border-[#F0A040] px-3 my-1 bg-[rgba(240,160,64,0.03)]' : 
            'border-b border-gray-100 last:border-0'
          }`}
        >
          <div className="text-[12px] font-medium text-gray-500 min-w-[44px] pt-0.5 tabular-nums">
            {item.time}
          </div>
          <div className="relative pl-6 flex-1 min-w-0">
            {/* Line connector */}
            {index < items.length - 1 && (
               <div className="absolute left-[4px] top-[14px] bottom-[-14px] w-[1.5px] bg-gray-200 group-last:hidden"></div>
            )}
            <div className={`absolute left-0 top-[5px] w-[9px] h-[9px] rounded-full shadow-[0_0_0_2px_white] z-1 ${dotColors[item.type]}`}></div>
            
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-gray-800 leading-snug truncate">
                  {item.status === 'ai' && '✦ '}{item.title}
                </div>
                <div className={`text-[11px] mt-0.5 ${item.status === 'ai' ? 'text-[#0A7E8C]' : item.status === 'pending' ? 'text-[#F0A040]' : 'text-gray-400'}`}>
                  {item.meta}
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ml-2 flex-none mt-0.5 ${badgeStyles[item.status]}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodaySchedule;
