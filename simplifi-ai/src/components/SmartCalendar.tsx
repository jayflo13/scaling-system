import React, { useState } from 'react';
import TodaySchedule from './TodaySchedule';

const SmartCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(25);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const otherDaysBefore = [31];
  const otherDaysAfter = [1, 2, 3, 4];
  const eventDays = [8, 10, 15, 16, 25, 26];

  const scheduleItems = [
    { id: '1', time: '9:00', title: 'Team Standup', meta: 'Zoom · 30 min', type: 'meeting' as const, status: 'manual' as const },
    { id: '2', time: '10:00', title: 'Deep Work — Product Design', meta: 'Auto-slot · Focus Hours window', type: 'focus' as const, status: 'ai' as const },
    { id: '3', time: '11:00', title: 'Gym Session', meta: 'AI found slot · Awaiting your OK', type: 'focus' as const, status: 'pending' as const },
    { id: '4', time: '12:00', title: 'Lunch with Sarah', meta: 'Downtown Bistro · 1 hr', type: 'personal' as const, status: 'manual' as const },
    { id: '5', time: '2:00', title: 'Client Call — Acme Corp', meta: 'Google Meet · 1 hr', type: 'meeting' as const, status: 'manual' as const },
    { id: '6', time: '4:30', title: 'Gym Session (rescheduled)', meta: 'Auto-moved · 45 min', type: 'health' as const, status: 'ai' as const },
  ];

  return (
    <div className="flex-1 max-w-6xl">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Smart Calendar</h1>
          <div className="text-sm text-gray-500 mt-1 font-normal">
            Simplifi AI finds the best slots for your flexible tasks · <strong>2 pending suggestions</strong>
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          <button className="px-4.5 py-2.25 rounded-lg text-[13px] font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all cursor-pointer">
            📥 Sync Now
          </button>
          <button className="bg-[#0A7E8C] text-white px-4.5 py-2.25 rounded-lg text-[13px] font-medium shadow-[0_1px_3px_rgba(10,126,140,0.15)] hover:bg-[#075B66] hover:shadow-[0_4px_12px_rgba(10,126,140,0.25)] transition-all cursor-pointer">
            ✦ Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
          <div className="px-5 py-4.5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
              📅 June 2026
            </h3>
            <div className="flex gap-3 text-sm text-gray-400 cursor-pointer">
              <span>‹</span><span>›</span>
            </div>
          </div>
          <div className="p-5 pt-3.5">
            <div className="grid grid-cols-7 gap-0.5 text-center text-[12px]">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-gray-400 font-medium py-1.5 uppercase tracking-wider">{day}</div>
              ))}
              {otherDaysBefore.map(d => (
                <div key={`prev-${d}`} className="py-2 rounded-lg text-gray-300 font-medium">{d}</div>
              ))}
              {days.map(d => (
                <div 
                  key={d} 
                  onClick={() => setSelectedDate(d)}
                  className={`py-2 rounded-lg cursor-pointer transition-all font-medium font-tabular-nums ${
                    d === 25 ? 'bg-[#0A7E8C] text-white font-semibold shadow-[0_2px_8px_rgba(10,126,140,0.2)]' : 
                    eventDays.includes(d) ? 'text-[#0A7E8C] font-semibold hover:bg-gray-50' : 
                    'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {d}
                </div>
              ))}
              {otherDaysAfter.map(d => (
                <div key={`next-${d}`} className="py-2 rounded-lg text-gray-300 font-medium">{d}</div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-2 h-2 rounded-[2px] bg-[#E0F2F4]"></span> AI-scheduled
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-2 h-2 rounded-[2px] border-[1.5px] border-dashed border-[#F0A040]"></span> Pending suggestion
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-2 h-2 rounded-[2px] bg-gray-200"></span> Manual event
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
          <div className="px-5 py-4.5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
              🗓️ Tuesday, June {selectedDate}
            </h3>
            <span className="text-[12px] text-[#0A7E8C] font-medium hover:text-[#075B66] cursor-pointer transition-colors">Auto-schedule here</span>
          </div>
          <div className="px-5 py-2 pb-4">
            <TodaySchedule items={scheduleItems} />
            <div className="flex items-start gap-3 py-2 px-3 rounded-lg border-[1.5px] border-dashed border-gray-300 mt-1">
              <div className="text-[12px] font-medium text-gray-500 min-w-[44px] pt-0.5 tabular-nums">+</div>
              <div className="relative pl-6 flex-1 min-w-0">
                <div className="absolute left-0 top-[5px] w-[9px] h-[9px] rounded-full bg-gray-300"></div>
                <div className="text-[13px] text-gray-400">Drop a flexible task here</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Quick-slot anything</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
        <div className="px-5 py-4.5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
            🎯 Flexible Tasks Queue
          </h3>
          <span className="text-[12px] text-[#0A7E8C] font-medium hover:text-[#075B66] cursor-pointer transition-colors">Optimize all</span>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: '💪', name: 'Gym Session', meta: '45 min · Prefers morning', status: 'suggested', statusText: '⏳ Suggested: 11:00 AM today' },
              { icon: '📋', name: 'Grocery Run', meta: '30 min · After work', status: 'suggested', statusText: '⏳ Suggested: Today 5:30 PM' },
              { icon: '🧘', name: 'Meditation', meta: '15 min · Any time', status: 'none', statusText: '— No good slot today' },
            ].map((task, i) => (
              <div key={i} className="p-3.5 border border-gray-200 rounded-lg bg-gray-50 hover:border-[#E0F2F4] hover:bg-white transition-all cursor-pointer">
                <div className="text-lg mb-1">{task.icon}</div>
                <div className="font-bold text-[13px] text-gray-800">{task.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{task.meta}</div>
                <div className={`text-[10px] mt-2 flex items-center gap-1 ${task.status === 'suggested' ? 'text-[#F0A040]' : 'text-gray-400'}`}>
                  {task.statusText}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3 items-center p-3.5 px-4.5 bg-[#E0F2F4] rounded-xl text-[13px] text-[#075B66]">
        <span className="text-lg">🤖</span>
        <span><strong>Pro tip:</strong> Type a task like "45 min gym tomorrow afternoon" in Quick Add — Simplifi AI will find the best slot automatically.</span>
      </div>
    </div>
  );
};

export default SmartCalendar;
