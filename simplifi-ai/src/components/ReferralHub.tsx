import React, { useState, useEffect } from 'react';

interface ReferralStats {
  totalInvites: number;
  pending: number;
  signedUp: number;
  onboarded: number;
  rewardsEarned: number;
}

interface ReferralHistoryItem {
  name: string;
  initials: string;
  status: string;
  time: string;
  color: string;
}

export const ReferralHub: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copySuccess, setSetCopySuccess] = useState(false);
  const userId = 'mock-user-123'; // In real app, get from auth context

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/growth/referral-stats/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch referral stats:', err);
      }
    };
    fetchStats();
  }, []);

  const referralLink = `simplifiai.com/join?ref=JAMIE47`; // Mock link

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setSetCopySuccess(true);
    setTimeout(() => setSetCopySuccess(false), 2000);
  };

  const history: ReferralHistoryItem[] = [
    { name: 'Sarah Kim', initials: 'SK', status: 'Completed onboarding ✓', time: 'Joined 2 days ago', color: 'bg-[#0A7E8C]' },
    { name: 'Mike Chen', initials: 'MC', status: 'Onboarding in progress', time: 'Signed up yesterday', color: 'bg-[#7C6FBA]' },
    { name: 'Alex Liu', initials: 'AL', status: 'Awaiting signup', time: 'Invite sent', color: 'bg-[#F0A040]' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">🤝 Simplifi Squad</h1>
          <div className="text-[0.875rem] text-gray-500 mt-1">
            Invite 3 friends who complete onboarding → get <strong className="text-gray-900 font-bold">3 months of Premium free</strong>.
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2 bg-[#0A7E8C] text-white rounded-lg text-sm font-semibold hover:bg-[#075B66] transition-all">
          ✦ Invite Friends
        </button>
      </div>

      {/* Progress Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
        <div className="w-14 h-14 bg-[#E0F2F4] rounded-2xl flex items-center justify-center text-2xl">🎯</div>
        <div className="flex-1">
          <div className="text-[0.9375rem] font-bold text-gray-900">3 for 3 — Your Progress</div>
          <div className="text-[0.8125rem] text-gray-500 max-w-lg mt-0.5">
            Invite 3 friends who complete onboarding and unlock 3 months of Premium free. Each friend gets an extended 30-day trial.
          </div>
        </div>
        <div className="text-center shrink-0 border-l border-gray-100 pl-6">
          <div className="text-3xl font-extrabold text-[#0A7E8C]">{stats?.onboarded || 1}/3</div>
          <div className="text-[0.6875rem] text-gray-400 font-medium uppercase tracking-wider">friends joined</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Referral Link Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]/50">
            <h3 className="text-sm font-bold flex items-center gap-2">🔗 Your Referral Link</h3>
            <span className="text-[0.75rem] text-[#0A7E8C] font-semibold cursor-pointer hover:underline" onClick={handleCopy}>
              {copySuccess ? 'Copied!' : 'Copy'}
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="flex-1 font-mono text-[0.75rem] text-gray-700 truncate">{referralLink}</span>
              <button onClick={handleCopy} className="text-[0.75rem] text-[#0A7E8C] font-bold uppercase tracking-wider">Copy</button>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 text-center border border-gray-200 rounded-lg text-[0.75rem] font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                𝕏 Tweet
              </button>
              <button className="flex-1 py-2 text-center border border-gray-200 rounded-lg text-[0.75rem] font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                in Post
              </button>
              <button className="flex-1 py-2 text-center border border-gray-200 rounded-lg text-[0.75rem] font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                📱 Message
              </button>
            </div>
            <div className="mt-4 p-3 bg-[#F8F9FA] rounded-xl text-[0.75rem] text-gray-500">
              📊 <strong className="text-gray-900">42</strong> link clicks · <strong className="text-gray-900">{stats?.signedUp || 3}</strong> signups · <strong className="text-gray-900">{stats?.onboarded || 1}</strong> completed onboarding
            </div>
          </div>
        </div>

        {/* Rewards Progress Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-[#F8F9FA]/50">
            <h3 className="text-sm font-bold flex items-center gap-2">🎁 Your Rewards</h3>
          </div>
          <div className="p-5 space-y-1">
            <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-7 h-7 rounded-full bg-[#E6F7EC] text-[#38A169] flex items-center justify-center text-[0.75rem] shrink-0 font-bold italic">✓</div>
              <div className="flex-1">
                <div className="text-[0.8125rem] font-bold text-gray-800">1 friend onboarded</div>
                <div className="text-[0.6875rem] text-gray-500">1 month Premium earned</div>
              </div>
              <span className="px-2 py-1 bg-[#E6F7EC] text-[#38A169] rounded text-[0.625rem] font-bold uppercase tracking-wider italic">✓ Claimed</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 opacity-100">
              <div className="w-7 h-7 rounded-full bg-[#E0F2F4] text-[#0A7E8C] flex items-center justify-center text-[0.75rem] shrink-0 font-bold italic">2</div>
              <div className="flex-1">
                <div className="text-[0.8125rem] font-bold text-gray-800">2 friends onboarded</div>
                <div className="text-[0.6875rem] text-gray-500">2 months Premium — 1 referral pending</div>
              </div>
              <span className="px-2 py-1 bg-[#F8F9FA] text-[#0A7E8C] border border-[#E0F2F4] rounded text-[0.625rem] font-bold uppercase tracking-wider italic">1/2</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 opacity-50">
              <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[0.75rem] shrink-0 font-bold italic">3</div>
              <div className="flex-1">
                <div className="text-[0.8125rem] font-bold text-gray-800">3 friends onboarded</div>
                <div className="text-[0.6875rem] text-gray-500">3 months Premium free — invite more!</div>
              </div>
              <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded text-[0.625rem] font-bold uppercase tracking-wider italic">Invite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]/50">
          <h3 className="text-sm font-bold flex items-center gap-2">📋 Referral History</h3>
          <span className="text-[0.75rem] text-[#0A7E8C] font-semibold cursor-pointer hover:underline">View all</span>
        </div>
        <div className="p-5 space-y-1">
          {history.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className={`w-9 h-9 rounded-full ${item.color} text-white flex items-center justify-center text-[0.75rem] font-bold shrink-0 shadow-sm`}>
                {item.initials}
              </div>
              <div className="flex-1">
                <div className="text-[0.875rem] font-bold text-gray-800">{item.name}</div>
                <div className="text-[0.75rem] text-gray-500">{item.time} · {item.status}</div>
              </div>
              <span className={`text-[0.6875rem] font-bold italic ${item.status.includes('✓') ? 'text-[#38A169]' : item.status.includes('signup') ? 'text-gray-400' : 'text-[#0A7E8C]'}`}>
                {item.status.includes('✓') ? 'Reward earned' : item.status.includes('signup') ? 'Pending' : 'In progress'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard CTA */}
      <div className="bg-[#E0F2F4] border border-[#0A7E8C]/10 rounded-2xl p-5 flex items-center gap-4 text-[#075B66]">
        <span className="text-2xl animate-bounce shrink-0">🏆</span>
        <div className="text-[0.875rem] leading-snug">
          <strong className="font-bold">Top Referrers:</strong> You're <span className="font-extrabold text-[#0A7E8C]">#12</span> of 847 on the leaderboard. Top 10 get <span className="underline decoration-wavy decoration-[#F0A040]">Lifetime Premium</span> (Founder's Club). Invite 3 more to break into the top 10!
        </div>
      </div>
    </div>
  );
};
