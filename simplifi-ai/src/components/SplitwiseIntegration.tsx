import React, { useState, useEffect } from 'react';

interface SplitwiseIntegrationProps {
  onBack: () => void;
}

export const SplitwiseIntegration: React.FC<SplitwiseIntegrationProps> = ({ onBack }) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const userId = 'mock-user-123';
        const res = await fetch(`/api/user/${userId}/splitwise/balances`);
        if (res.ok) {
          const data = await res.json();
          setBalances(data);
        }
      } catch (err) {
        console.error('Failed to fetch Splitwise balances:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  if (showConnectModal) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-10">
        <div className="bg-white rounded-2xl shadow-lg max-w-[480px] w-full p-10 border border-gray-200 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">💰</div>
            <h2 className="text-xl font-bold text-gray-900">Connect Splitwise</h2>
            <p className="text-sm text-gray-500">Simplifi AI will track shared expenses and help you stay on top of splits.</p>
          </div>

          <p className="text-[0.8125rem] font-semibold text-gray-700 mb-3">Permissions required:</p>
          <div className="space-y-0 mb-7">
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
              <span className="text-base">📊</span>
              <div className="text-sm text-gray-700">View <strong>expenses & balances</strong> across groups</div>
            </div>
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
              <span className="text-base">👥</span>
              <div className="text-sm text-gray-700">Access <strong>group memberships</strong> (roommates, family)</div>
            </div>
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
              <span className="text-base">🔄</span>
              <div className="text-sm text-gray-700">Track <strong>recurring bills</strong> and suggest splits</div>
            </div>
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 border-none">
              <span className="text-base">🔔</span>
              <div className="text-sm text-gray-700">Send <strong>smart reminders</strong> for upcoming settlements</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg mb-5 text-[0.8125rem] text-gray-600 overflow-hidden">
            <span className="text-base flex-shrink-0">🔗</span>
            <span className="font-mono text-[0.7rem] text-gray-700 truncate">api.splitwise.com/v3/authorize?client_id=sw_...</span>
            <span className="text-[0.7rem] text-[#0A7E8C] font-semibold cursor-pointer flex-shrink-0">Copy</span>
          </div>

          <div className="flex gap-2.5">
            <button onClick={() => setShowConnectModal(false)} className="flex-1 py-3 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">Cancel</button>
            <button onClick={() => setShowConnectModal(false)} className="flex-2 py-3 rounded-lg text-sm font-semibold bg-[#0A7E8C] text-white hover:bg-[#075B66] transition-all shadow-md">✦ Connect Splitwise</button>
          </div>
          <div className="text-center mt-3.5 text-[0.75rem] text-gray-400">We use OAuth 2.0. Your data is encrypted. <span className="text-[#0A7E8C] cursor-pointer">Learn more</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-6xl">
      <div className="flex justify-between items-start mb-7">
        <div>
          <button onClick={onBack} className="text-xs text-[#0A7E8C] font-medium mb-2 flex items-center gap-1 hover:underline">
            ← Back to Integrations
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">💰 Splitwise Summary</h1>
          <p className="text-sm text-gray-500 mt-1">Shared expenses powered by Simplifi AI · <strong>2 groups active</strong></p>
        </div>
        <div className="flex gap-2.5 items-center">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-[0.8125rem] font-medium hover:border-gray-400 hover:bg-gray-50 transition-all">➕ Add Expense</button>
          <button className="bg-[#0A7E8C] text-white px-4 py-2 rounded-lg text-[0.8125rem] font-medium hover:bg-[#075B66] transition-all shadow-sm">✦ Settle Up</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {balances.map((b, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-all">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-[0.9375rem] font-semibold text-gray-800 flex items-center gap-2">👥 {b.group}</h3>
              <span className="text-xs text-[#0A7E8C] font-medium cursor-pointer hover:text-[#075B66]">View all →</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                <div className={`w-8 h-8 rounded-full ${b.balance >= 0 ? 'bg-[#E6F7EC] text-[#38A169]' : 'bg-[#FEF3E4] text-[#F0A040]'} flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0`}>
                  {b.balance >= 0 ? '▲' : '▼'}
                </div>
                <div className="flex-1 text-[0.8125rem] text-gray-700">
                  {b.balance >= 0 ? "You're owed" : "You owe"} <strong className={`${b.balance >= 0 ? 'text-[#38A169]' : 'text-[#F0A040]'} font-bold`}>${Math.abs(b.balance).toFixed(2)}</strong>
                </div>
              </div>
              <div className="py-2.5 space-y-2">
                <div className="flex justify-between text-[0.75rem] text-gray-500 py-1">
                  <span>Recent Transaction 1</span>
                  <span className="text-gray-700">$25.00</span>
                </div>
                <div className="flex justify-between text-[0.75rem] text-gray-500 py-1">
                  <span>Recent Transaction 2</span>
                  <span className="text-gray-700">$30.20</span>
                </div>
              </div>
              <div className="mt-2 pt-2.5 border-t border-gray-100 text-[0.75rem] text-gray-500 flex justify-between">
                <span>🤖 <strong className="text-[#0A7E8C]">Auto-tracked</strong> by Simplifi AI</span>
                <span className="text-[#0A7E8C] font-semibold cursor-pointer hover:underline">Details →</span>
              </div>
            </div>
          </div>
        ))}

        {balances.length === 0 && !loading && (
          <>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-all">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-[0.9375rem] font-semibold text-gray-800 flex items-center gap-2">👥 Roommates (3 people)</h3>
                <span className="text-xs text-[#0A7E8C] font-medium cursor-pointer hover:text-[#075B66]">View all →</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7EC] text-[#38A169] flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">▲</div>
                  <div className="flex-1 text-[0.8125rem] text-gray-700">You're owed <strong className="text-[#38A169] font-bold">$45.20</strong></div>
                  <span className="text-[0.6875rem] text-gray-400">from Alex & Jordan</span>
                </div>
                <div className="py-2.5 space-y-2">
                  <div className="flex justify-between text-[0.75rem] text-gray-500 py-1">
                    <span>Internet (Jun) — $75.00</span>
                    <span className="text-gray-700">$25.00 <span className="text-gray-400 font-normal">each</span></span>
                  </div>
                  <div className="flex justify-between text-[0.75rem] text-gray-500 py-1">
                    <span>Electricity (Jun) — $90.60</span>
                    <span className="text-gray-700">$30.20 <span className="text-gray-400 font-normal">each</span></span>
                  </div>
                  <div className="flex justify-between text-[0.75rem] text-gray-500 py-1">
                    <span>Grocery run (6/24)</span>
                    <span className="text-gray-700">-$18.50 <span className="text-gray-400 font-normal">paid by you</span></span>
                  </div>
                </div>
                <div className="mt-2 pt-2.5 border-t border-gray-100 text-[0.75rem] text-gray-500 flex justify-between">
                  <span>🤖 <strong className="text-[#0A7E8C]">3 auto-tracked</strong> this month</span>
                  <span className="text-[#0A7E8C] font-semibold cursor-pointer hover:underline">Suggest split →</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-all">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-[0.9375rem] font-semibold text-gray-800 flex items-center gap-2">✈️ Trip to Portland (4 people)</h3>
                <span className="text-xs text-[#0A7E8C] font-medium cursor-pointer hover:text-[#075B66]">View all →</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#FEF3E4] text-[#F0A040] flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">▼</div>
                  <div className="flex-1 text-[0.8125rem] text-gray-700">You owe <strong className="text-[#F0A040] font-bold">$132.00</strong></div>
                  <span className="text-[0.6875rem] text-gray-400">to Morgan & Taylor</span>
                </div>
                <div className="py-2.5 space-y-2">
                  <div className="flex justify-between text-[0.75rem] text-gray-500 py-1">
                    <span>Airbnb (3 nights)</span>
                    <span className="text-gray-700">$187.50 <span className="text-gray-400 font-normal">your share</span></span>
                  </div>
                  <div className="flex justify-between text-[0.75rem] text-gray-500 py-1">
                    <span>Dinner — June 22</span>
                    <span className="text-gray-700">$38.00 <span className="text-gray-400 font-normal">your share</span></span>
                  </div>
                  <div className="flex justify-between text-[0.75rem] text-gray-500 py-1">
                    <span>Gas (round trip)</span>
                    <span className="text-gray-700">-$28.50 <span className="text-gray-400 font-normal">paid by you</span></span>
                  </div>
                </div>
                <div className="mt-2 pt-2.5 border-t border-gray-100 text-[0.75rem] text-gray-500 flex justify-between">
                  <span>🤖 <strong className="text-[#0A7E8C]">2 auto-tracked</strong> this trip</span>
                  <span className="text-[#0A7E8C] font-semibold cursor-pointer hover:underline">Add expense →</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 p-4 bg-[#E0F2F4] rounded-xl text-[0.8125rem] text-[#075B66]">
        <span className="text-lg">🤖</span>
        <span><strong>Pro tip:</strong> Simplifi AI can auto-detect shared expenses from your email receipts and suggest Splitwise entries. Enable in Preferences.</span>
      </div>
    </div>
  );
};
