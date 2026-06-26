import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  icon: string;
  trend: string;
  color: 'teal' | 'violet' | 'amber' | 'green';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, unit, detail, icon, trend, color }) => {
  const colorMap = {
    teal: 'bg-[#E0F2F4]',
    violet: 'bg-[#F0EDF8]',
    amber: 'bg-[#FEF3E4]',
    green: 'bg-[#E6F7EC]',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all hover:shadow-md hover:translate-y-[-2px] relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${trend.includes('↑') || trend.includes('+') ? 'bg-[#E6F7EC] text-[#38A169]' : 'bg-gray-100 text-gray-500'}`}>
          {trend}
        </span>
      </div>
      <div className="text-xs text-gray-500 font-medium mb-0.5">{label}</div>
      <div className="text-[28px] font-bold text-gray-900 leading-tight tracking-tight">
        {value} {unit && <span className="text-base font-normal text-gray-400">{unit}</span>}
      </div>
      <div className="text-[12px] text-gray-400 mt-1">{detail}</div>
    </div>
  );
};

export default StatsCard;
