import React, { useState } from 'react';

const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedFocus, setSelectedFocus] = useState('Work Focus');
  const [focusTime, setFocusTime] = useState('Early (6–9 AM)');

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-1.5">⏱️</div>
                <div className="text-[12px] font-semibold text-gray-700">Save hours</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Automate small stuff</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-1.5">🧘</div>
                <div className="text-[12px] font-semibold text-gray-700">Calm mind</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Less mental load</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-1.5">🤖</div>
                <div className="text-[12px] font-semibold text-gray-700">Set & forget</div>
                <div className="text-[11px] text-gray-500 mt-0.5">AI handles it</div>
              </div>
            </div>

            <p className="text-[14px] font-semibold text-gray-800 mb-3 text-center">What matters most to you?</p>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {[
                { icon: '💼', name: 'Work Focus', desc: 'Deep work, meetings' },
                { icon: '💪', name: 'Health & Wellness', desc: 'Gym, meditation' },
                { icon: '👨‍👩‍👧‍👦', name: 'Family Time', desc: 'Dinner, activities' },
                { icon: '📋', name: 'Life Admin', desc: 'Errands, groceries' },
              ].map(pref => (
                <div 
                  key={pref.name}
                  onClick={() => setSelectedFocus(pref.name)}
                  className={`p-4 border-[1.5px] rounded-xl text-center cursor-pointer transition-all ${
                    selectedFocus === pref.name ? 'border-[#0A7E8C] bg-[#E0F2F4] shadow-[0_0_0_3px_rgba(10,126,140,0.1)]' : 'border-gray-200 hover:border-[#E0F2F4] hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{pref.icon}</div>
                  <div className="text-[13px] font-semibold text-gray-800">{pref.name}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{pref.desc}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3.5 rounded-lg bg-[#0A7E8C] text-white font-bold text-[14px] shadow-[0_4px_12px_rgba(10,126,140,0.25)] hover:bg-[#075B66] hover:translate-y-[-1px] transition-all cursor-pointer">
              Next Step ➜
            </button>
          </>
        );
      case 2:
        return (
          <>
            <p className="text-[14px] font-semibold text-gray-800 mb-3 text-center">When is your ideal <strong>Focus Time</strong>?</p>
            <div className="flex flex-wrap gap-2 justify-center mb-7">
              {['🌅 Early (6–9 AM)', '☀️ Morning (9–12 PM)', '🌤️ Afternoon (12–5 PM)', '🌙 Evening (5–9 PM)'].map(time => (
                <span 
                  key={time}
                  onClick={() => setFocusTime(time)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium border cursor-pointer transition-all ${
                    focusTime === time ? 'bg-[#E0F2F4] border-[#0A7E8C] text-[#0A7E8C]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#0A7E8C]'
                  }`}
                >
                  {time}
                </span>
              ))}
            </div>

            <p className="text-[14px] font-semibold text-gray-800 mb-3 text-center">Connect your accounts</p>
            <div className="flex gap-2.5 mb-8">
              <div className="flex-1 p-3.5 border-[1.5px] border-gray-200 rounded-xl text-center cursor-pointer hover:border-[#0A7E8C] transition-all bg-white">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-[12px] font-semibold text-gray-700">Google Cal</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Recommended</div>
              </div>
              <div className="flex-1 p-3.5 border-[1.5px] border-gray-200 rounded-xl text-center cursor-pointer hover:border-[#0A7E8C] transition-all bg-white">
                <div className="text-2xl mb-1">📧</div>
                <div className="text-[12px] font-semibold text-gray-700">Email</div>
                <div className="text-[10px] text-gray-400 mt-0.5">For reminders</div>
              </div>
              <div className="flex-1 p-3.5 border border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-[#0A7E8C] transition-all bg-white">
                <div className="text-2xl mb-1">➕</div>
                <div className="text-[12px] font-semibold text-gray-400">More</div>
                <div className="text-[10px] text-gray-300 mt-0.5">Later</div>
              </div>
            </div>

            <button onClick={() => setStep(3)} className="w-full py-3.5 rounded-lg bg-[#0A7E8C] text-white font-bold text-[14px] shadow-[0_4px_12px_rgba(10,126,140,0.25)] hover:bg-[#075B66] hover:translate-y-[-1px] transition-all cursor-pointer">
              Continue ✦
            </button>
          </>
        );
      case 3:
        return (
          <div className="text-center py-4">
            <div className="text-5xl mb-6">✨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
            <p className="text-gray-500 text-[14px] mb-8 leading-relaxed">Simplifi AI is now analyzing your schedule and preferences. We'll start finding the best slots for your tasks immediately.</p>
            <button onClick={onComplete} className="w-full py-3.5 rounded-lg bg-[#0A7E8C] text-white font-bold text-[14px] shadow-[0_4px_12px_rgba(10,126,140,0.25)] hover:bg-[#075B66] hover:translate-y-[-1px] transition-all cursor-pointer">
              Go to Dashboard ➜
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F8F9FA] to-white flex items-center justify-center p-6">
      <div className="max-w-[560px] w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
        <div className="flex justify-center gap-2 mb-9">
          <span className={`w-2 h-2 rounded-full transition-all ${step === 1 ? 'bg-[#0A7E8C] w-7 rounded-sm' : step > 1 ? 'bg-[#E0F2F4]' : 'bg-gray-200'}`}></span>
          <span className={`w-2 h-2 rounded-full transition-all ${step === 2 ? 'bg-[#0A7E8C] w-7 rounded-sm' : step > 2 ? 'bg-[#E0F2F4]' : 'bg-gray-200'}`}></span>
          <span className={`w-2 h-2 rounded-full transition-all ${step === 3 ? 'bg-[#0A7E8C] w-7 rounded-sm' : 'bg-gray-200'}`}></span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-1.5 tracking-tight">Welcome to Simplifi AI ✦</h2>
        <p className="text-[14px] text-gray-500 text-center mb-8 leading-relaxed">Let's get to know you in 60 seconds. The more you share, the smarter we schedule.</p>

        {renderStep()}

        {step < 3 && (
          <div className="text-center mt-4 text-[13px] text-gray-400 hover:text-gray-600 cursor-pointer" onClick={onComplete}>
            Skip for now — I'll set it up later
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
