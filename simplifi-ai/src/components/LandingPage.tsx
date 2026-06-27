import React, { useEffect, useRef } from 'react';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create animated particles in the hero section
    const hero = heroRef.current;
    if (!hero) return;

    const particleCount = 20;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      const size = Math.random() * 6 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.background = ['#0A7E8C', '#7C6FBA', '#38A169', '#F0A040'][Math.floor(Math.random() * 4)];
      particle.style.setProperty('--duration', `${Math.random() * 10 + 12}s`);
      particle.style.setProperty('--delay', `${Math.random() * 8}s`);
      particle.style.setProperty('--opacity', `${Math.random() * 0.12 + 0.05}`);
      hero.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#212529]">
      {/* Hero */}
      <section 
        ref={heroRef}
        className="hero-gradient-wave text-center py-20 px-6 relative overflow-hidden"
      >
        {/* Ambient glow orbs */}
        <div className="hero-ambient-orb" />
        <div className="hero-ambient-orb" />
        <div className="hero-ambient-orb" />
        
        {/* Particle container */}
        <div className="hero-particles" />

        {/* Decorative backdrop ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#0A7E8C]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-[#0A7E8C]/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#0A7E8C]/8 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          <div className="hero-reveal-text inline-flex items-center gap-2 text-[1.1rem] font-semibold text-[#0A7E8C] mb-5 py-1.5 px-4 border border-[#0A7E8C]/15 rounded-full bg-white/70 backdrop-blur-sm">
            ✦ Simplifi <span className="font-light">AI</span>
          </div>
          <h1 className="hero-reveal-text text-5xl md:text-6xl font-extrabold text-[#212529] tracking-tight leading-tight mb-4 max-w-3xl mx-auto">
            Reclaim Your <span className="text-[#0A7E8C]">Mental Freedom</span>.<br />Reclaim Your Week.
          </h1>
          <p className="hero-reveal-text text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            That constant "to-do" list running in the back of your mind? Let it go. Simplifi AI is the invisible hand that manages your life admin, so you can finally stop juggling and start breathing.
          </p>
          <div className="hero-reveal-text flex flex-wrap gap-3 justify-center">
            <button 
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A7E8C] text-white rounded-lg font-bold text-[0.9375rem] shadow-lg shadow-[#0A7E8C]/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0A7E8C]/35 transition-all"
            >
              ✦ Experience the Relief — Get Started Free
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm border-1.5 border-gray-300 text-gray-700 rounded-lg font-bold text-[0.9375rem] hover:border-gray-400 hover:bg-white transition-all">
              ▶ Watch the 60-second Demo
            </button>
          </div>
          <div className="hero-reveal-text flex flex-wrap gap-6 justify-center mt-8">
            <span className="text-[0.8125rem] text-gray-500 flex items-center gap-1.5">
              <span className="text-[#38A169] font-bold">✓</span> No credit card required
            </span>
            <span className="text-[0.8125rem] text-gray-500 flex items-center gap-1.5">
              <span className="text-[#38A169] font-bold">✓</span> Connects in 60 seconds
            </span>
            <span className="text-[0.8125rem] text-gray-500 flex items-center gap-1.5">
              <span className="text-[#38A169] font-bold">✓</span> Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-[0.75rem] font-bold text-[#0A7E8C] uppercase tracking-widest text-center mb-2">How It Works</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#212529] tracking-tight text-center mb-3">Sync. Automate. Breathe.</h2>
          <p className="text-gray-500 text-center max-w-lg mx-auto mb-12 leading-relaxed">
            Three simple steps to reclaim your mental bandwidth. No tutorials. No learning curve.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-[#F8F9FA] rounded-2xl text-center hover:bg-white hover:shadow-xl transition-all group">
              <div className="text-4xl mb-4">🔗</div>
              <div className="w-12 h-12 rounded-full bg-[#0A7E8C] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-[1.15rem] font-bold mb-2">Sync Your Life</h3>
              <p className="text-[0.875rem] text-gray-600 leading-relaxed">Connect your Google Calendar, Outlook, and Email in seconds. Simplifi AI builds a context-aware map of your commitments and preferences.</p>
            </div>
            <div className="p-8 bg-[#F8F9FA] rounded-2xl text-center hover:bg-white hover:shadow-xl transition-all group">
              <div className="text-4xl mb-4">🤖</div>
              <div className="w-12 h-12 rounded-full bg-[#7C6FBA] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-[1.15rem] font-bold mb-2">Let the AI Automate</h3>
              <p className="text-[0.875rem] text-gray-600 leading-relaxed">From auto-slotting your gym sessions to scheduling travel buffers, Simplifi AI handles the repetitive "mental load" tasks on your behalf.</p>
            </div>
            <div className="p-8 bg-[#F8F9FA] rounded-2xl text-center hover:bg-white hover:shadow-xl transition-all group">
              <div className="text-4xl mb-4">🧘</div>
              <div className="w-12 h-12 rounded-full bg-[#38A169] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-[1.15rem] font-bold mb-2">Breathe</h3>
              <p className="text-[0.875rem] text-gray-600 leading-relaxed">Wake up to your Daily Brief — a minimalist summary of everything Simplifi AI has handled while you were resting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[0.75rem] font-bold text-[#0A7E8C] uppercase tracking-widest text-center mb-2">Pricing</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#212529] tracking-tight text-center mb-3">Transparent & Simple</h2>
          <p className="text-gray-500 text-center max-w-lg mx-auto mb-12 leading-relaxed">
            Free for basics. Premium for complete mental relief.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="p-9 bg-white border border-gray-200 rounded-2xl hover:shadow-xl transition-all">
              <div className="text-[1.25rem] font-bold mb-1">Basic</div>
              <div className="text-4xl font-extrabold text-[#212529] mb-1">$0 <span className="text-lg font-normal text-gray-400">/mo</span></div>
              <p className="text-[0.8125rem] text-gray-500 mb-5 leading-relaxed">Perfect for individuals just starting to automate their schedule.</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center gap-2 text-[0.8125rem] text-gray-700 py-2 border-b border-gray-100"><span className="text-[#38A169] font-bold">✓</span> 1 Calendar Integration</li>
                <li className="flex items-center gap-2 text-[0.8125rem] text-gray-700 py-2 border-b border-gray-100"><span className="text-[#38A169] font-bold">✓</span> 5 Auto-scheduled Slots / Week</li>
                <li className="flex items-center gap-2 text-[0.8125rem] text-gray-700 py-2 border-b border-gray-100"><span className="text-[#38A169] font-bold">✓</span> Basic Daily Brief</li>
              </ul>
              <button 
                onClick={onGetStarted}
                className="w-full py-3 text-center border-1.5 border-gray-300 rounded-lg text-gray-700 font-bold text-[0.875rem] hover:bg-gray-50 transition-all"
              >
                Join the Waitlist
              </button>
            </div>
            <div className="p-9 bg-white border-2 border-[#0A7E8C] rounded-2xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0A7E8C] text-white px-4 py-1 rounded-b-xl text-[0.6875rem] font-bold uppercase tracking-wider">Most Popular</div>
              <div className="text-[1.25rem] font-bold mb-1 mt-2">Premium</div>
              <div className="text-4xl font-extrabold text-[#212529] mb-1">$14.99 <span className="text-lg font-normal text-gray-400">/mo</span></div>
              <p className="text-[0.8125rem] text-gray-500 mb-5 leading-relaxed">Full access to the Simplifi AI suite for families and professionals.</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center gap-2 text-[0.8125rem] text-gray-700 py-2 border-b border-gray-100"><span className="text-[#38A169] font-bold">✓</span> Unlimited Integrations</li>
                <li className="flex items-center gap-2 text-[0.8125rem] text-gray-700 py-2 border-b border-gray-100"><span className="text-[#38A169] font-bold">✓</span> Kroger & Splitwise Support</li>
                <li className="flex items-center gap-2 text-[0.8125rem] text-gray-700 py-2 border-b border-gray-100"><span className="text-[#38A169] font-bold">✓</span> Family Sharing (Beta)</li>
                <li className="flex items-center gap-2 text-[0.8125rem] text-gray-700 py-2"><span className="text-[#38A169] font-bold">✓</span> Smart Buffer Optimization</li>
              </ul>
              <button 
                onClick={onGetStarted}
                className="w-full py-3 text-center bg-[#0A7E8C] text-white rounded-lg font-bold text-[0.875rem] hover:bg-[#075B66] transition-all"
              >
                Get Premium Early
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-[#0A7E8C] to-[#075B66] text-white rounded-3xl text-center shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to stop juggling?</h2>
          <p className="text-white/90 mb-8 max-w-md mx-auto">Join the 500+ professionals who are reclaiming their mental freedom with Simplifi AI.</p>
          <button 
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#0A7E8C] rounded-lg font-bold text-[0.9375rem] shadow-xl hover:-translate-y-0.5 transition-all"
          >
            ✦ Join the Restricted Beta
          </button>
          <div className="mt-4 text-[0.8125rem] opacity-70">Only 42 spots remaining in the first cohort.</div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center text-[0.8125rem] text-gray-400">
        &copy; 2026 Simplifi AI. All rights reserved. ✦ Reclaim Your Mental Freedom.
      </footer>
    </div>
  );
};

export default LandingPage;