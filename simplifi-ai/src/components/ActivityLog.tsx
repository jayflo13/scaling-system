import React from 'react';

const ActivityLog: React.FC = () => {
  const activityItems = [
    { 
      id: '1', 
      type: 'reschedule', 
      icon: '↔️', 
      title: '<strong>Rescheduled</strong> <strong>Gym Session</strong> from <span class="text-[#0A7E8C] font-medium">3:00 PM → 4:30 PM</span>', 
      reason: 'Incoming Client Call (Acme Corp, 2-3 PM) needed 1 hour buffer', 
      time: '8:12 AM',
      hasUndo: true
    },
    { 
      id: '2', 
      type: 'add', 
      icon: '🕐', 
      title: '<strong>Auto-scheduled</strong> 45 min <strong>Deep Work — Product Design</strong> at <span class="text-[#0A7E8C] font-medium">10:00 AM</span>', 
      reason: 'Slot found in your Focus Hours window (9 AM–12 PM preference)', 
      time: '7:30 AM',
      hasUndo: true
    },
    { 
      id: '3', 
      type: 'warn', 
      icon: '✈️', 
      title: '<strong>Proactive reminder:</strong> You have a flight tomorrow. Blocked <span class="text-[#0A7E8C] font-medium">2 hours (7–9 PM)</span> for packing', 
      reason: 'Detected from flight confirmation email (Subject: "Your JetBlue confirmation")', 
      time: '6:00 AM',
      hasDismiss: true
    },
    { 
      id: '4', 
      type: 'add', 
      icon: '🛒', 
      title: '<strong>Suggested</strong> <strong>Grocery Run</strong> at <span class="text-[#0A7E8C] font-medium">5:30 PM</span> on the way home from work', 
      reason: 'Learned pattern: You usually grocery shop Thursdays after work (3 weeks detected)', 
      time: '5:00 AM',
      hasConfirm: true,
      hasDismiss: true
    },
  ];

  const yesterdayItems = [
    { 
      id: '5', 
      type: 'check', 
      icon: '✔️', 
      title: '<strong>Completed</strong> <strong>Deep Work — Product Design</strong> — marked as done', 
      reason: 'Auto-checked after calendar event ended', 
      time: '11:00 AM'
    },
    { 
      id: '6', 
      type: 'reschedule', 
      icon: '↔️', 
      title: '<strong>Rescheduled</strong> <strong>Dentist Appointment</strong> from 2:00 PM → <span class="text-[#0A7E8C] font-medium">next Tuesday 10:00 AM</span>', 
      reason: 'Conflict with unexpected team offsite. Found open slot next week.', 
      time: '9:30 AM',
      hasUndo: true
    },
    { 
      id: '7', 
      type: 'link', 
      icon: '🔗', 
      title: '<strong>Connected</strong> Google Calendar — <span class="text-[#0A7E8C] font-medium">43 existing events</span> synced and analyzed', 
      reason: 'Initial integration completed. Learning schedule patterns...', 
      time: '9:15 AM'
    },
  ];

  const iconBgMap: Record<string, string> = {
    move: 'bg-[#FFF3E0]',
    add: 'bg-[#E0F2F4]',
    warn: 'bg-[#FFF8E1]',
    check: 'bg-[#E6F7EC]',
    link: 'bg-[#F0EDF8]',
    reschedule: 'bg-[#FFF3E0]',
  };

  return (
    <div className="flex-1 max-w-6xl">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Activity Log</h1>
          <div className="text-sm text-gray-500 mt-1 font-normal">
            Every action Simplifi AI has taken — <strong>transparent, explained, and reversible</strong>
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          <button className="px-4.5 py-2.25 rounded-lg text-[13px] font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all cursor-pointer">
            📥 Export
          </button>
          <button className="bg-[#0A7E8C] text-white px-4.5 py-2.25 rounded-lg text-[13px] font-medium shadow-[0_1px_3px_rgba(10,126,140,0.15)] hover:bg-[#075B66] hover:shadow-[0_4px_12px_rgba(10,126,140,0.25)] transition-all cursor-pointer">
            ✦ Filter
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {['All Actions', 'Scheduling', 'Reminders', 'Reschedules', 'Suggestions', 'Integrations'].map((filter, i) => (
          <span key={filter} className={`px-4 py-1.75 rounded-full text-[12px] font-medium border cursor-pointer transition-all ${i === 0 ? 'bg-[#E0F2F4] border-[#0A7E8C] text-[#0A7E8C]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {filter}
          </span>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-white px-5 pt-4.5 pb-2.5 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
          Today · June 25, 2026
        </div>

        <div className="divide-y divide-gray-100">
          {activityItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition-all group">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] flex-none mt-0.5 ${iconBgMap[item.type]}`}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.title }} />
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                  <span className="text-gray-500">{item.reason}</span>
                  <span>· {item.time}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-none mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                {item.hasUndo && (
                  <button className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer">Undo</button>
                )}
                {item.hasConfirm && (
                  <button className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#E0F2F4] text-[#0A7E8C] hover:bg-[#0A7E8C] hover:text-white transition-all cursor-pointer">Confirm</button>
                )}
                {item.hasDismiss && (
                  <button className="text-[11px] font-medium px-2.5 py-1 rounded-md text-gray-400 hover:text-gray-600 transition-all cursor-pointer">✕</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-gray-100 mx-5"></div>
        <div className="bg-white px-5 pt-4.5 pb-2.5 text-[12px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-100 mt-0">
          Yesterday · June 24, 2026
        </div>

        <div className="divide-y divide-gray-100">
          {yesterdayItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition-all group">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] flex-none mt-0.5 ${iconBgMap[item.type]}`}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.title }} />
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                  <span className="text-gray-500">{item.reason}</span>
                  <span>· {item.time}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-none mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                {item.hasUndo && (
                  <button className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer">Undo</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-5 p-5 bg-gray-50 border-t border-gray-200 text-[12px] text-gray-600">
          <div><strong>27</strong> total actions this week</div>
          <div><strong>3.2</strong> hours saved</div>
          <div><strong>4</strong> integrations active</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
