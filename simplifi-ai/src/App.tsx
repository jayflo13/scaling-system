import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DailyBrief from './components/DailyBrief';
import SmartCalendar from './components/SmartCalendar';
import ActivityLog from './components/ActivityLog';
import Onboarding from './components/Onboarding';
import SyncStatus from './components/SyncStatus';

const MainLayout: React.FC<{ children: React.ReactNode, userName: string, plan: string, currentScreen: string, onScreenChange: (screen: string) => void }> = ({ children, userName, plan, currentScreen, onScreenChange }) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans antialiased text-[#212529]">
      <Sidebar userName={userName} plan={plan} currentScreen={currentScreen} onScreenChange={onScreenChange} />
      <main className="flex-1 p-8 pt-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [userName, setUserName] = useState('Jamie Doe');
  const [plan, setPlan] = useState('Premium Plan');
  const [isOnboarded, setIsOnboardingComplete] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  useEffect(() => {
    // Attempt to fetch real data
    const fetchData = async () => {
      try {
        const userId = 'mock-user-123';
        const prefRes = await fetch(`/api/user/${userId}/preferences`);
        if (prefRes.ok) {
          const prefs = await prefRes.json();
          setUserName(prefs.name || 'Jamie Doe');
          if (prefs.focus_hours) setIsOnboardingComplete(true);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchData();
  }, []);

  // Mock data for Daily Brief
  const stats = [
    { label: 'Time Saved Today', value: '47', unit: 'min', detail: "That's 3.7 hours this week", icon: '⏱️', trend: '↑12% today', color: 'teal' as const },
    { label: 'Tasks Automated', value: '8', detail: '2 manual · 6 auto-scheduled by AI', icon: '✅', trend: '6 auto', color: 'green' as const },
    { label: 'Events Today', value: '5', detail: '3 meetings · 2 flexible blocks', icon: '📅', trend: '5 events', color: 'violet' as const },
    { label: 'AI Actions', value: '3', detail: '1 reschedule · 2 new slots', icon: '🤖', trend: '+1 today', color: 'amber' as const },
  ];

  const activityItems = [
    { id: '1', type: 'reschedule' as const, title: '<strong>Rescheduled</strong> Gym Session from <span class="text-[#0A7E8C] font-medium">3:00 PM → 4:30 PM</span>', reason: 'To make room for Client Call (Acme Corp)', time: '8:12 AM' },
    { id: '2', type: 'booked' as const, title: '<strong>Auto-scheduled</strong> 45 min <strong>Deep Work Block</strong> at <span class="text-[#0A7E8C] font-medium">10:00 AM</span>', reason: 'Found in your Focus Hours window (9 AM–12 PM)', time: '7:30 AM' },
    { id: '3', type: 'suggest' as const, title: '<strong>Suggested</strong> Grocery Run at <span class="text-[#0A7E8C] font-medium">5:30 PM</span> on the way home', reason: 'Recurring Thursday habit detected (3 weeks)', time: 'Yesterday' },
    { id: '4', type: 'alert' as const, title: '<strong>Proactive:</strong> Flight tomorrow. Blocked <span class="text-[#0A7E8C] font-medium">2 hours (7–9 PM)</span> for packing', reason: 'Detected from your flight confirmation email', time: '6:00 AM' },
  ];

  const scheduleItems = [
    { id: '1', time: '9:00', title: 'Team Standup', meta: '30 min · Zoom', type: 'meeting' as const, status: 'manual' as const },
    { id: '2', time: '10:00', title: 'Deep Work — Product Design', meta: '45 min · Auto-scheduled by AI', type: 'focus' as const, status: 'ai' as const },
    { id: '3', time: '11:00', title: 'Gym Session → Pending confirmation', meta: 'AI found slot · Awaiting your OK', type: 'focus' as const, status: 'pending' as const },
    { id: '4', time: '12:00', title: 'Lunch with Sarah', meta: '1 hr · Downtown Bistro', type: 'personal' as const, status: 'manual' as const },
    { id: '5', time: '2:00', title: 'Client Call — Acme Corp', meta: '1 hr · Google Meet', type: 'meeting' as const, status: 'manual' as const },
    { id: '6', time: '4:30', title: 'Gym Session (moved from 3PM)', meta: '45 min · Rescheduled for Client Call', type: 'health' as const, status: 'ai' as const },
  ];

  if (!isOnboarded) {
    return <Onboarding onComplete={() => setIsOnboardingComplete(true)} />;
  }

  return (
    <MainLayout userName={userName} plan={plan} currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
      {currentScreen === 'dashboard' && (
        <DailyBrief 
          userName={userName} 
          stats={stats} 
          activityItems={activityItems} 
          scheduleItems={scheduleItems} 
        />
      )}
      {currentScreen === 'calendar' && <SmartCalendar />}
      {currentScreen === 'activity' && <ActivityLog />}
    </MainLayout>
  );
};

export default App;
