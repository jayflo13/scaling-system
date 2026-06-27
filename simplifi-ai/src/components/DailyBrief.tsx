import React from 'react';
import StatsCard from './StatsCard';
import ActivityFeed from './ActivityFeed';
import TodaySchedule from './TodaySchedule';
import QuickAdd from './QuickAdd';
import SyncStatus from './SyncStatus';

interface DailyBriefProps {
  userName: string;
  stats: any[];
  activityItems: any[];
  scheduleItems: any[];
}

const DailyBrief: React.FC<DailyBriefProps> = ({ userName, stats, activityItems, scheduleItems }) => {
  const userId = 'mock-user-123'; // In a real app, this would come from auth context

  return (
    <div className="flex-1 max-w-6xl pb-20">
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
            Good morning, {userName.split(' ')[0]} ✨
          </h1>
          <div className="text-sm text-gray-500 mt-1 font-normal">
            Tuesday, June 25 · Simplifi AI already handled <strong className="text-gray-700 font-medium">2 tasks</strong> for you today
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          <button className="px-4.5 py-2.25 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer">
            ⚡ Quick Add
          </button>
          <button className="bg-[#0A7E8C] text-white px-4.5 py-2.25 rounded-lg text-[13px] font-medium shadow-[0_1px_3px_rgba(10,126,140,0.15)] hover:bg-[#075B66] hover:shadow-[0_4px_12px_rgba(10,126,140,0.25)] hover:translate-y-[-1px] transition-all cursor-pointer">
            ✦ New Task
          </button>
          <button className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center text-lg text-gray-600 hover:bg-gray-50 transition-all relative cursor-pointer">
            🔔 <span className="absolute top-1.5 right-1.5 w-1.75 h-1.75 bg-[#F0A040] rounded-full border-2 border-white animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Activity Feed Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
          <div className="px-5 py-4.5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
              🤖 What Simplifi AI Did Today
            </h3>
            <span className="text-[12px] text-[#0A7E8C] font-medium hover:text-[#075B66] cursor-pointer transition-colors">View all →</span>
          </div>
          <div className="px-5 py-2 pb-4">
            <ActivityFeed items={activityItems} />
          </div>
        </div>

        {/* Today's Schedule Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
          <div className="px-5 py-4.5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
              📅 Today's Schedule
            </h3>
            <span className="text-[12px] text-[#0A7E8C] font-medium hover:text-[#075B66] cursor-pointer transition-colors">Full calendar →</span>
          </div>
          <div className="px-5 py-2 pb-4">
            <TodaySchedule items={scheduleItems} />
          </div>
        </div>
      </div>

      {/* Quick Add Section */}
      <QuickAdd />

      {/* Sync Status Section */}
      <div className="mt-8">
        <SyncStatus userId={userId} variant="detailed" />
      </div>

      {/* Mockup Frame Watermark */}
      <div className="fixed top-2 right-2 bg-[rgba(10,126,140,0.08)] border border-[rgba(10,126,140,0.15)] text-[#0A7E8C] px-3 py-1.25 rounded-full text-[10px] font-medium pointer-events-none z-50 backdrop-blur-xs">
        ✦ Live Dashboard — Daily Brief
      </div>
    </div>
  );
};

export default DailyBrief;
