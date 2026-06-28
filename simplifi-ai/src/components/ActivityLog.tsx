import React from 'react';
import MilestoneStreak from './MilestoneStreak';

const ActivityLog: React.FC = () => {
  const activityItems = [
    { 
      id: '1', 
      type: 'reschedule', 
      icon: '↔️', 
      title: '<strong>Rescheduled</strong> <strong>Gym Session</strong> from <span class="text-[#0A7E8C] font-medium">3:00 PM → 4:30 PM</span>', 
      reason: 'Incoming Client Call (Acme Corp, 2-3 PM) needed 1 hour buffer', 
      time: '8:12 AM',
      hasUndo: true,
      confidence: 95,
      status: 'AI-Confirmed'
    },
    { 
      id: '2', 
      type: 'add', 
      icon: '🕐', 
      title: '<strong>Auto-scheduled</strong> 45 min <strong>Deep Work — Product Design</strong> at <span class="text-[#0A7E8C] font-medium">10:00 AM</span>', 
      reason: 'Slot found in your Focus Hours window (9 AM–12 PM preference)', 
      time: '7:30 AM',
      hasUndo: true,
      confidence: 98,
      status: 'AI-Confirmed'
    },
    { 
      id: '3', 
      type: 'warn', 
      icon: '✈️', 
      title: '<strong>Proactive reminder:</strong> You have a flight tomorrow. Blocked <span class="text-[#0A7E8C] font-medium">2 hours (7–9 PM)</span> for packing', 
      reason: 'Detected from flight confirmation email (Subject: "Your JetBlue confirmation")', 
      time: '6:00 AM',
      hasDismiss: true,
      status: 'Notification'
    },
    { 
      id: '4', 
      type: 'add', 
      icon: '🛒', 
      title: '<strong>Suggested</strong> <strong>Grocery Run</strong> at <span class="text-[#0A7E8C] font-medium">5:30 PM</span> on the way home from work', 
      reason: 'Learned pattern: You usually grocery shop Thursdays after work (3 weeks detected)', 
      time: '5:00 AM',
      hasConfirm: true,
      hasDismiss: true,
      status: 'User-Corrected',
      confidence: 82
    },
  ];

  const yesterdayItems = [
    { 
      id: '5', 
      type: 'check', 
      icon: '✔️', 
      title: '<strong>Completed</strong> <strong>Deep Work — Product Design</strong> — marked as done', 
      reason: 'Auto-checked after calendar event ended', 
      time: '11:00 AM',
      status: 'AI-Confirmed',
      confidence: 100
    },
    { 
      id: '6', 
      type: 'reschedule', 
      icon: '↔️', 
      title: '<strong>Rescheduled</strong> <strong>Dentist Appointment</strong> from 2:00 PM → <span class="text-[#0A7E8C] font-medium">next Tuesday 10:00 AM</span>', 
      reason: 'Conflict with unexpected team offsite. Found open slot next week.', 
      time: '9:30 AM',
      hasUndo: true,
      status: 'AI-Confirmed',
      confidence: 92
    },
    { 
      id: '7', 
      type: 'link', 
      icon: '🔗', 
      title: '<strong>Connected</strong> Google Calendar — <span class="text-[#0A7E8C] font-medium">43 existing events</span> synced and analyzed', 
      reason: 'Initial integration completed. Learning schedule patterns...', 
      time: '9:15 AM',
      status: 'Integration'
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white border border-red-200 rounded-xl overflow-hidden mb-6 border-l-4 border-red-500 shadow-sm">
            <div className="bg-red-50 px-5 py-3.5 flex justify-between items-center">
              <h4 className="text-sm font-bold text-red-700 flex items-center gap-2">
                ⚠️ 3 integrations need attention
              </h4>
              <button className="text-[11px] font-semibold text-red-600 hover:text-red-800">Dismiss all</button>
            </div>
            <div className="p-0 divide-y divide-gray-100">
              <div className="px-5 py-4 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs flex-none">!</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    Google Calendar <span className="text-red-500 text-[11px] font-bold">⚠️ Auth Expired</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Last synced 3 days ago - Events may be outdated</div>
                  <button className="mt-2.5 px-3 py-1.5 bg-red-600 text-white text-[11px] font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                    ↻ Reconnect Now
                  </button>
                </div>
              </div>
              <div className="px-5 py-4 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs flex-none">!</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">Gmail - Sync Failed</div>
                  <div className="text-xs text-gray-500 mt-0.5">Rate limit exceeded. Gmail API quota resets in 47 minutes.</div>
                  <button className="mt-2.5 px-3 py-1.5 bg-[#0A7E8C] text-white text-[11px] font-bold rounded-lg hover:bg-[#075B66] transition-colors shadow-sm">
                    ↻ Retry Sync
                  </button>
                </div>
              </div>
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
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[13px] text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.title }} />
                      {item.status && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight ${
                          item.status === 'AI-Confirmed' ? 'bg-[#E0F2F4] text-[#0A7E8C]' : 
                          item.status === 'User-Corrected' ? 'bg-amber-50 text-amber-600' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                      <span className="text-gray-500">{item.reason}</span>
                      <span>· {item.time}</span>
                      {item.confidence && (
                        <span className="flex items-center gap-1">
                          · <span className="w-1 h-1 rounded-full bg-green-500"></span>
                          {item.confidence}% confidence
                        </span>
                      )}
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
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[13px] text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.title }} />
                      {item.status && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight ${
                          item.status === 'AI-Confirmed' ? 'bg-[#E0F2F4] text-[#0A7E8C]' : 
                          item.status === 'User-Corrected' ? 'bg-amber-50 text-amber-600' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                      <span className="text-gray-500">{item.reason}</span>
                      <span>· {item.time}</span>
                      {item.confidence && (
                        <span className="flex items-center gap-1">
                          · <span className="w-1 h-1 rounded-full bg-green-500"></span>
                          {item.confidence}% confidence
                        </span>
                      )}
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
        <div className="lg:col-span-1 space-y-6">
          <MilestoneStreak />
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Streak Progression</h3>
            <div className="space-y-3">
              {[
                { label: 'Trusted', sub: '3+ consecutive confirms', status: 'Unlocked', color: 'text-green-600' },
                { label: 'High Confidence', sub: '5-day streak', status: 'Active', color: 'text-[#0A7E8C]' },
                { label: 'Ultra Trust', sub: '14-day streak', status: '3/14 days', color: 'text-gray-400' }
              ].map(level => (
                <div key={level.label} className="flex justify-between items-center text-[11px]">
                  <div>
                    <div className="font-semibold text-gray-700">{level.label}</div>
                    <div className="text-gray-400">{level.sub}</div>
                  </div>
                  <div className={`font-bold ${level.color}`}>{level.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
