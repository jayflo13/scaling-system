import React from 'react';

interface IntegrationsHubProps {
  onConnectKroger: () => void;
  onConnectSplitwise: () => void;
  onViewGrocery: () => void;
  onViewExpenses: () => void;
}

export const IntegrationsHub: React.FC<IntegrationsHubProps> = ({ 
  onConnectKroger, 
  onConnectSplitwise,
  onViewGrocery,
  onViewExpenses
}) => {
  return (
    <div className="flex-1 p-8 max-w-6xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">🔗 Integrations</h1>
          <p className="text-sm text-gray-500 mt-1">Connect your accounts to unlock smart automations · <strong>2 of 6</strong> connected</p>
        </div>
        <button className="bg-[#0A7E8C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#075B66] transition-all shadow-sm">
          ✦ Browse All
        </button>
      </div>

      <div className="mb-4">
        <p className="text-[0.6875rem] font-semibold text-gray-400 uppercase tracking-widest mb-3">Connected</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kroger Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer" onClick={onViewGrocery}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF3E0] flex items-center justify-center text-2xl">🛒</div>
              <div>
                <div className="text-[1.05rem] font-semibold text-gray-900">Kroger</div>
                <div className="text-[0.8125rem] text-gray-500">Grocery pickup & delivery</div>
              </div>
              <span className="ml-auto text-gray-300 text-xl cursor-pointer hover:text-gray-500">⚙️</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#E6F7EC] text-[#38A169]">
              <span className="w-2 h-2 rounded-full bg-[#38A169]"></span> Connected
            </span>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-[0.8125rem] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38A169]"></span> Auto-create shopping lists from meal plans
              </div>
              <div className="flex items-center gap-2 text-[0.8125rem] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38A169]"></span> Add items with voice or text
              </div>
              <div className="flex items-center gap-2 text-[0.8125rem] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38A169]"></span> Schedule pickup/delivery slots
              </div>
            </div>
          </div>

          {/* Splitwise Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer" onClick={onViewExpenses}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0EDF8] flex items-center justify-center text-2xl">💰</div>
              <div>
                <div className="text-[1.05rem] font-semibold text-gray-900">Splitwise</div>
                <div className="text-[0.8125rem] text-gray-500">Expense splitting</div>
              </div>
              <span className="ml-auto text-gray-300 text-xl cursor-pointer hover:text-gray-500">⚙️</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#E6F7EC] text-[#38A169]">
              <span className="w-2 h-2 rounded-full bg-[#38A169]"></span> Connected
            </span>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-[0.8125rem] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38A169]"></span> Auto-track shared household expenses
              </div>
              <div className="flex items-center gap-2 text-[0.8125rem] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38A169]"></span> Categorize by group (roommates, family)
              </div>
              <div className="flex items-center gap-2 text-[0.8125rem] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38A169]"></span> Settle up reminders
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-[0.6875rem] font-semibold text-gray-400 uppercase tracking-widest mb-3">Available to Connect</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 border-1.5 border-dashed border-gray-300 rounded-xl text-center hover:bg-gray-50 transition-all cursor-pointer">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-[0.75rem] font-medium text-gray-600">Google Calendar</div>
            <div className="text-[0.625rem] text-[#38A169] mt-1">✓ Connected</div>
          </div>
          <div className="p-5 border-1.5 border-dashed border-gray-300 rounded-xl text-center hover:bg-gray-50 transition-all cursor-pointer">
            <div className="text-2xl mb-2">📧</div>
            <div className="text-[0.75rem] font-medium text-gray-600">Gmail</div>
            <div className="text-[0.625rem] text-[#38A169] mt-1">✓ Connected</div>
          </div>
          <div className="p-5 border-1.5 border-dashed border-gray-300 rounded-xl text-center hover:bg-gray-50 transition-all cursor-pointer" onClick={onConnectKroger}>
            <div className="text-2xl mb-2">🛒</div>
            <div className="text-[0.75rem] font-medium text-gray-600">Kroger</div>
            <div className="text-[0.625rem] text-gray-400 mt-1">— Not connected</div>
          </div>
          <div className="p-5 border-1.5 border-dashed border-gray-300 rounded-xl text-center hover:bg-gray-50 transition-all cursor-pointer" onClick={onConnectSplitwise}>
            <div className="text-2xl mb-2">💰</div>
            <div className="text-[0.75rem] font-medium text-gray-600">Splitwise</div>
            <div className="text-[0.625rem] text-gray-400 mt-1">— Not connected</div>
          </div>
        </div>
      </div>
    </div>
  );
};
