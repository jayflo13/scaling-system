import React, { useState, useEffect } from 'react';

interface BetaSignupProps {
  onSuccess: () => void;
}

const BetaSignup: React.FC<BetaSignupProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    calendarProvider: 'google',
    householdStatus: 'single',
    krogerUser: false,
    splitwiseUser: false,
    upcomingTravel: false,
    motivation: '',
    referralCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [myReferralCode, setMyReferralCode] = useState('');

  useEffect(() => {
    // Check for referral code in URL
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const ref = params.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/beta/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setMyReferralCode(data.referralCode);
        setIsSuccess(true);
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    const referralLink = `${window.location.origin}/#beta-signup?ref=${myReferralCode}`;
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Received!</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Thanks for applying to the Simplifi AI Premium Beta. We're reviewing applicants now and will reach out via email if you're selected for the first cohort.
        </p>
        
        <div className="bg-[#E0F2F4]/30 border border-[#0A7E8C]/20 p-6 rounded-2xl mb-8 max-w-md mx-auto text-left">
          <h3 className="text-[#0A7E8C] font-bold mb-2">Want to move up faster?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Share your unique referral link. For every friend who signs up, you'll jump ahead in line!
          </p>
          <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-2">
            <input
              readOnly
              className="flex-1 bg-transparent border-none text-sm font-mono text-gray-600 focus:outline-none"
              value={referralLink}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                alert('Referral link copied!');
              }}
              className="px-4 py-2 bg-[#0A7E8C] text-white text-xs font-bold rounded-lg hover:bg-[#075B66]"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="bg-[#E0F2F4] p-6 rounded-xl border border-[#0A7E8C]/20 max-w-sm mx-auto">
          <p className="text-[#0A7E8C] font-semibold mb-2">What's next?</p>
          <p className="text-[14px] text-gray-600">Keep an eye on your inbox for an invite to our private Slack community!</p>
        </div>

        <button
          onClick={() => window.location.hash = 'waitlist'}
          className="mt-8 text-[#0A7E8C] font-semibold hover:underline"
        >
          Check your waitlist position ➜
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-[#0A7E8C] p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Join the Premium Beta ✦</h2>
        <p className="text-[#E0F2F4] text-sm opacity-90">Help us stress-test the future of "Life Admin" automation.</p>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A7E8C] transition-all"
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              required
              type="email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A7E8C] transition-all"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Primary Calendar Provider</label>
          <select
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A7E8C] transition-all"
            value={formData.calendarProvider}
            onChange={(e) => setFormData({ ...formData, calendarProvider: e.target.value })}
          >
            <option value="google">Google Calendar</option>
            <option value="outlook">Outlook / Microsoft 365</option>
            <option value="icloud">iCloud</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Household Status</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              onClick={() => setFormData({ ...formData, householdStatus: 'single' })}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                formData.householdStatus === 'single' ? 'border-[#0A7E8C] bg-[#E0F2F4]/30' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-[14px]">Solo Resident</div>
              <div className="text-[11px] text-gray-500">I manage my own schedule only.</div>
            </div>
            <div
              onClick={() => setFormData({ ...formData, householdStatus: 'household' })}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                formData.householdStatus === 'household' ? 'border-[#0A7E8C] bg-[#E0F2F4]/30' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-[14px]">Household Manager</div>
              <div className="text-[11px] text-gray-500">I coordinate for a partner/family.</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Check all that apply</label>
          <div className="flex flex-col gap-2">
            {[
              { id: 'krogerUser', label: 'I shop at Kroger-owned stores regularly' },
              { id: 'splitwiseUser', label: 'I use Splitwise for expense tracking' },
              { id: 'upcomingTravel', label: 'I have 2+ trips/flights booked in the next 30 days' }
            ].map(item => (
              <label key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0A7E8C] rounded border-gray-300 focus:ring-[#0A7E8C]"
                  checked={formData[item.id as keyof typeof formData] as boolean}
                  onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                />
                <span className="text-[13px] text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Why do you want to join the beta?</label>
          <textarea
            required
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A7E8C] transition-all resize-none"
            placeholder="Tell us about your biggest life-admin pain points..."
            value={formData.motivation}
            onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          />
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-4 rounded-xl bg-[#0A7E8C] text-white font-bold text-lg shadow-lg hover:bg-[#075B66] hover:translate-y-[-1px] transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Apply for Beta ➜'}
        </button>
      </form>
    </div>
  );
};

export default BetaSignup;
