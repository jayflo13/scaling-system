import React, { useEffect, useRef } from 'react';

interface MilestoneProps {
  type: 'bronze' | 'silver' | 'gold';
  title: string;
  stat: string;
  description: string;
  date: string;
}

const MilestoneCard: React.FC<MilestoneProps> = ({ type, title, stat, description, date }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create sparkle particles for the medal area on gold achievements
    if (type !== 'gold' || !cardRef.current) return;
    const header = cardRef.current.querySelector('.milestone-card-header');
    if (!header) return;

    const sparkleCount = 8;
    const sparkles: HTMLDivElement[] = [];

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      const dx = (Math.random() - 0.5) * 40;
      const dy = (Math.random() - 0.5) * 40 - 10;
      sparkle.style.setProperty('--dx', `${dx}px`);
      sparkle.style.setProperty('--dy', `${dy}px`);
      sparkle.style.background = ['#FFD700', '#FFA500', '#FFE082', '#FFF8E1'][Math.floor(Math.random() * 4)];
      header.appendChild(sparkle);
      sparkles.push(sparkle);
    }

    return () => {
      sparkles.forEach(s => s.remove());
    };
  }, [type]);

  const styles = {
    bronze: "from-[#FDF6E3] to-[#F5E6CC]",
    silver: "from-[#F0F4F8] to-[#E2E8F0]",
    gold: "from-[#FFF8E1] to-[#FFE082]"
  };

  const cardBorderClass = type === 'gold' ? 'milestone-gold border-[#FFD700]/30' : 'border-gray-200';

  return (
    <div 
      ref={cardRef}
      className={`milestone-card bg-white rounded-[24px] overflow-hidden border ${cardBorderClass} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group`}
    >
      <div className={`milestone-card-header p-10 text-center relative overflow-hidden bg-gradient-to-br ${styles[type]}`}>
        {/* Decorative elements */}
        <div className="absolute top-[-20px] right-[-20px] text-white/20 text-9xl pointer-events-none select-none">✦</div>
        
        {/* Medal with shimmer */}
        <div className="medal-shimmer w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center relative z-10 bg-white/60 backdrop-blur-sm">
          <span className="text-5xl relative z-10 float-slow">
            {type === 'bronze' && '🥉'}
            {type === 'silver' && '🥈'}
            {type === 'gold' && '🥇'}
          </span>
        </div>

        <div className="text-[1.1rem] font-bold text-gray-800 mb-1 relative z-10">{title}</div>
        <div className="text-[0.75rem] text-gray-500 font-bold uppercase tracking-[0.15em] relative z-10">
          {type === 'gold' ? '🏆 Premium Achievement' : `${type.charAt(0).toUpperCase() + type.slice(1)} Achievement`}
        </div>
      </div>
      <div className="p-8 text-center">
        <div className="text-3xl font-extrabold text-[#212529] mb-2 tracking-tight">{stat}</div>
        <p className="text-[0.875rem] text-gray-500 mb-6 leading-relaxed px-4">{description}</p>
        <div className="flex flex-col gap-2">
          <button className="w-full py-3 bg-[#0A7E8C] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0A7E8C]/20 hover:bg-[#075B66] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            Share Achievement
          </button>
          <div className="text-[0.6875rem] text-gray-400 font-medium mt-2 italic">Earned on {date}</div>
        </div>
      </div>
    </div>
  );
};

export const MilestoneHub: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Milestone Achievements</h1>
          <p className="text-gray-500">Collect and share your productivity wins with the Simplifi AI community.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-[#0A7E8C]">3/12 Collected</div>
          <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="w-[25%] h-full bg-gradient-to-r from-[#0A7E8C] to-[#38A169] rounded-full progress-fill" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <MilestoneCard 
          type="bronze"
          title="The First Hour"
          stat="60 Minutes Saved"
          description="You reclaimed your first full hour of mental freedom. The journey begins."
          date="Oct 12, 2026"
        />
        <MilestoneCard 
          type="silver"
          title="Weekly Win"
          stat="5+ Hours Saved"
          description="A full work week optimized. You're now operating at peak efficiency."
          date="Oct 19, 2026"
        />
        <MilestoneCard 
          type="gold"
          title="The Centurion"
          stat="100 Tasks Automated"
          description="Absolute automation mastery. You've offloaded 100 logistics tasks to Simplifi AI."
          date="Oct 26, 2026"
        />
      </div>

      <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center">
        <h3 className="font-bold text-gray-800 mb-2">Unlock More Milestones</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">Continue using Simplifi AI to automate your life admin and earn exclusive badge assets for your profile.</p>
        <div className="flex justify-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center grayscale opacity-40 hover:opacity-60 hover:scale-110 transition-all duration-300">🔐</div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center grayscale opacity-40 hover:opacity-60 hover:scale-110 transition-all duration-300">🔐</div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center grayscale opacity-40 hover:opacity-60 hover:scale-110 transition-all duration-300">🔐</div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center grayscale opacity-40 hover:opacity-60 hover:scale-110 transition-all duration-300">🔐</div>
        </div>
      </div>
    </div>
  );
};