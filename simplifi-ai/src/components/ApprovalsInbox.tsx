import React, { useState, useEffect } from 'react';

interface ApprovalItem {
  id: string;
  type: 'schedule' | 'grocery' | 'expense';
  title: string;
  description: string;
  aiReason: string;
  tag?: string;
  tagType?: 'new' | 'expiring';
}

const ApprovalsInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);

  useEffect(() => {
    // Mock data based on design
    setApprovals([
      {
        id: '1',
        type: 'schedule',
        title: 'Team Standup overlaps with Dentist Appointment',
        description: 'AI found a scheduling conflict. Dentist (Wed 2:00-3:00 PM) clashes with weekly Standup (Wed 2:30-3:00 PM).',
        aiReason: 'AI suggestion: Reschedule Dentist to Thu 10:00 AM - 3 open slots available',
        tag: 'Expires in 4h',
        tagType: 'expiring'
      },
      {
        id: '2',
        type: 'grocery',
        title: 'Weekly Grocery Restock - Kroger',
        description: 'Based on your shopping history, AI prepared a restock list: Milk, Eggs, Bread, Spinach, Chicken Breast.',
        aiReason: 'Estimated total: $34.20 - Kroger pickup available Thu 5:00 PM',
        tag: 'Auto-sync ready',
        tagType: 'new'
      },
      {
        id: '3',
        type: 'expense',
        title: 'Splitwise - Categorize shared dinner expense',
        description: '$86.40 at "Lucca Ristorante" - AI categorized as "Dining Out." Split 4 ways ($21.60/person).',
        aiReason: 'Matches your previous "Dinner with Team" pattern'
      },
      {
        id: '4',
        type: 'schedule',
        title: 'AI-Suggested Focus Block - Thursday 9-11 AM',
        description: 'Your calendar shows no meetings Thursday morning. AI recommends a 2-hour focus block for Q3 planning.',
        aiReason: 'Based on your "Focus Time" preference (mornings, no meetings)',
        tag: 'New suggestion',
        tagType: 'new'
      }
    ]);
  }, []);

  const filteredApprovals = activeTab === 'All' 
    ? approvals 
    : approvals.filter(item => {
        if (activeTab === 'Schedule') return item.type === 'schedule';
        if (activeTab === 'Grocery') return item.type === 'grocery';
        if (activeTab === 'Bills') return item.type === 'expense';
        return true;
      });

  const getIcon = (type: string) => {
    switch (type) {
      case 'schedule': return '📅';
      case 'grocery': return '🛒';
      case 'expense': return '💳';
      default: return '◈';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pending Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve AI suggestions — your input trains the system to work better.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Auto-approve all</button>
          <button className="px-3 py-1.5 text-xs font-medium bg-[#0A7E8C] text-white hover:bg-[#075B66] rounded-lg transition-colors shadow-sm">Approve All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex justify-between items-start mb-2">
            <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-lg">⏳</div>
          </div>
          <div className="text-xs font-medium text-gray-500 mb-0.5">Pending Review</div>
          <div className="text-2xl font-bold text-gray-900">4</div>
          <div className="text-[11px] text-gray-400 mt-1">2 expiring within 24h</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex justify-between items-start mb-2">
            <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-lg">✓</div>
          </div>
          <div className="text-xs font-medium text-gray-500 mb-0.5">Auto-Approved Today</div>
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-[11px] text-gray-400 mt-1">Based on learned preferences</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex justify-between items-start mb-2">
            <div className="w-9 h-9 bg-[#E0F2F4] text-[#0A7E8C] rounded-lg flex items-center justify-center text-lg">⚡</div>
          </div>
          <div className="text-xs font-medium text-gray-500 mb-0.5">Confidence Streak</div>
          <div className="text-2xl font-bold text-gray-900">5 <span className="text-sm font-normal text-gray-400">days</span></div>
          <div className="text-[11px] text-gray-400 mt-1">No corrections needed</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-bottom border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-sm font-semibold text-gray-800">Suggestions Awaiting Review</h3>
          <button className="text-[11px] font-medium text-[#0A7E8C] hover:text-[#075B66]">Sort by: Priority</button>
        </div>
        
        <div className="flex gap-4 px-5 border-b border-gray-100">
          {['All', 'Schedule', 'Grocery', 'Bills'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 px-1 text-xs font-semibold border-b-2 transition-colors relative ${activeTab === tab ? 'border-[#0A7E8C] text-[#0A7E8C]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-[#E0F2F4] text-[#0A7E8C]' : 'bg-gray-100 text-gray-600'}`}>
                {tab === 'All' ? approvals.length : approvals.filter(a => (tab === 'Schedule' && a.type === 'schedule') || (tab === 'Grocery' && a.type === 'grocery') || (tab === 'Bills' && a.type === 'expense')).length}
              </span>
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-100">
          {filteredApprovals.map(item => (
            <div key={item.id} className={`p-5 flex gap-4 transition-colors hover:bg-gray-50 ${item.tagType === 'expiring' ? 'border-l-4 border-amber-400' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-none ${item.type === 'schedule' ? 'bg-[#E0F2F4]' : item.type === 'grocery' ? 'bg-green-50' : 'bg-purple-50'}`}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 truncate">{item.title}</div>
                <div className="text-xs text-gray-500 mt-1 line-height-relaxed">{item.description}</div>
                <div className="text-[11px] text-[#0A7E8C] font-medium mt-2 flex items-center gap-1.5">
                  ✦ {item.aiReason}
                </div>
                {item.tag && (
                  <span className={`inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] font-medium ${item.tagType === 'new' ? 'bg-[#E0F2F4] text-[#0A7E8C]' : 'bg-amber-50 text-amber-700'}`}>
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-none items-center self-start mt-1">
                <button className="px-3 py-1.5 text-[11px] font-semibold bg-[#E0F2F4] text-[#0A7E8C] hover:bg-[#0A7E8C] hover:text-white rounded-lg transition-colors">Edit</button>
                <button className="px-3 py-1.5 text-[11px] font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">Skip</button>
                <button className="px-3 py-1.5 text-[11px] font-semibold bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors shadow-sm">Approve</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#E0F2F4] p-4 rounded-xl border-l-4 border-[#0A7E8C] flex gap-3 shadow-sm">
        <span className="text-lg">💡</span>
        <div className="text-[12px] leading-relaxed text-[#075B66]">
          <strong className="block mb-0.5">Why approve?</strong>
          Each approval teaches the AI your preferences. After 5 consecutive approvals without corrections, you unlock the <strong>"High Confidence"</strong> streak - enabling more auto-decisions on your behalf.
        </div>
      </div>
    </div>
  );
};

export default ApprovalsInbox;
