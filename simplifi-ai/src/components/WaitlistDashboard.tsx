import React, { useState, useEffect } from 'react';

interface WaitlistData {
  name: string;
  email: string;
  score: number;
  rank: number;
  referral_code: string;
  status: string;
}

export const WaitlistDashboard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [data, setData] = useState<WaitlistData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  const checkStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/beta/applicant/${email}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
        // Animate progress bar after data loads
        setTimeout(() => {
          setProgressWidth(Math.max(5, 100 - (result.rank / 100)));
        }, 200);
      } else {
        setError('Applicant not found. Please make sure you used the correct email.');
      }
    } catch (err) {
      setError('Failed to fetch status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Reset progress animation when clearing data
  useEffect(() => {
    if (!data) {
      setProgressWidth(0);
    }
  }, [data]);

  const referralLink = data ? `${window.location.origin}/#beta-signup?ref=${data.referral_code}` : '';

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Format rank as digits for animation
  const rankDigits = data ? data.rank.toString().split('') : [];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Waitlist Status</h1>
        <div className="text-gray-500">Track your progress and move up the line for the Restricted Beta.</div>
      </div>

      {!data ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-[#E0F2F4] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 float-slow">🔍</div>
          <h2 className="text-xl font-bold mb-3">Check Your Position</h2>
          <p className="text-gray-500 mb-8">Enter the email you used to apply for the beta to see your current rank and referral link.</p>
          <form onSubmit={checkStatus} className="space-y-4">
            <input
              type="email"
              placeholder="alex@example.com"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A7E8C]/20 focus:border-[#0A7E8C] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0A7E8C] text-white font-bold rounded-xl hover:bg-[#075B66] transition-all disabled:opacity-50 shadow-lg shadow-[#0A7E8C]/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching...
                </span>
              ) : (
                '✦ View My Status'
              )}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Rank Card with animated counter */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
              {/* Orbital rank visualization */}
              <div className="rank-orbit mb-6">
                <div className="rank-orbit-ring" />
                <div className="rank-orbit-ring" />
                <div className="rank-orbit-ring" />
                <div className="rank-orbit-center">
                  <span className="rank-counter">
                    {rankDigits.map((digit, i) => (
                      <span key={i} className="rank-digit">{digit}</span>
                    ))}
                  </span>
                </div>
              </div>

              <div className="text-[0.875rem] text-gray-500 font-medium uppercase tracking-widest mb-6">Your Current Rank</div>
              
              {/* Animated progress bar */}
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3 progress-bar-glow">
                <div 
                  className="h-full bg-gradient-to-r from-[#0A7E8C] via-[#38A169] to-[#F0A040] rounded-full transition-all duration-[1500ms] ease-out progress-fill"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <div className="flex justify-between text-[0.6875rem] text-gray-400 font-bold uppercase tracking-wider">
                <span className="text-[#0A7E8C]">
                  {data.rank <= 100 ? '🎯 Top 100!' : `#${data.rank} of 8,402`}
                </span>
                <span>Waitlist of 8,402</span>
              </div>
            </div>

            {/* Referral Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]/50">
                <h3 className="text-sm font-bold flex items-center gap-2">🔗 Move Up Faster</h3>
                <span className="text-[0.75rem] text-[#0A7E8C] font-semibold cursor-pointer hover:underline" onClick={handleCopy}>
                  {copySuccess ? 'Copied!' : 'Copy'}
                </span>
              </div>
              <div className="p-6">
                <p className="text-[0.875rem] text-gray-500 mb-4">
                  For every friend who joins via your link, you'll jump <strong className="text-gray-900 font-bold">100+ spots</strong> ahead.
                </p>
                <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                  <span className="flex-1 font-mono text-[0.75rem] text-gray-700 truncate">{referralLink}</span>
                  <button onClick={handleCopy} className="text-[0.75rem] text-[#0A7E8C] font-bold uppercase tracking-wider hover:underline">Copy</button>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 text-center border border-gray-200 rounded-lg text-[0.75rem] font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">𝕏 Tweet</button>
                  <button className="flex-1 py-2.5 text-center border border-gray-200 rounded-lg text-[0.75rem] font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">in Post</button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setData(null)}
              className="w-full py-2 text-gray-400 text-[0.75rem] font-bold uppercase tracking-widest hover:text-[#0A7E8C] transition-colors"
            >
              ← Check another email
            </button>
          </div>

          <div className="space-y-6">
            {/* Founder's Club Mini-Card */}
            <div className="bg-gradient-to-br from-[#0A7E8C] to-[#075B66] text-white rounded-2xl p-6 shadow-lg shadow-[#0A7E8C]/20 relative overflow-hidden">
              {/* Subtle animated background accent */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />
              <div className="text-2xl mb-2 relative z-10">🏆</div>
              <h3 className="font-bold text-[0.9375rem] mb-2 relative z-10">Founder's Club</h3>
              <p className="text-[0.75rem] text-white/80 leading-relaxed mb-4 relative z-10">
                The Top 10 referrers gain <strong className="text-white">Lifetime Premium Access</strong> and are admitted to the Private Slack community immediately.
              </p>
              <div className="text-[0.6875rem] font-bold bg-white/10 py-2 px-3 rounded-lg border border-white/10 relative z-10">
                Current Threshold: 12 referrals
              </div>
            </div>

            {/* How to Gain Points */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-[0.875rem] mb-4">How to Move Up</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-[#E6F7EC] text-[#38A169] flex items-center justify-center text-[0.625rem] font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">+10</div>
                  <div className="text-[0.75rem] text-gray-600">Per friend who joins the waitlist.</div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-[#E0F2F4] text-[#0A7E8C] flex items-center justify-center text-[0.625rem] font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">+50</div>
                  <div className="text-[0.75rem] text-gray-600">Per friend admitted to the beta.</div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-[#FEF3E4] text-[#F0A040] flex items-center justify-center text-[0.625rem] font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">+100</div>
                  <div className="text-[0.75rem] text-gray-600">Share your milestone on social media.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};