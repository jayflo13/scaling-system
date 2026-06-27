import React, { useState, useEffect } from 'react';

interface KrogerIntegrationProps {
  onBack: () => void;
}

export const KrogerIntegration: React.FC<KrogerIntegrationProps> = ({ onBack }) => {
  const [, setIsConnected] = useState(true); // Default to true for demo purposes
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = 'mock-user-123';
        const res = await fetch(`/api/user/${userId}/kroger/cart`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setItems(data.map((item: any) => ({
              name: item.upc, // In a real app, we'd look up the name
              quantity: item.quantity,
              checked: item.status === 'completed'
            })));
          } else {
            // Fallback to mock data if empty
            setItems([
              { name: 'Organic Baby Spinach', quantity: '1 bag', checked: true },
              { name: 'Avocados (ripe)', quantity: '3', checked: false },
              { name: 'Chicken Breast (boneless)', quantity: '2 lbs', checked: false },
              { name: 'Greek Yogurt (plain)', quantity: '32 oz', checked: false },
              { name: 'Sourdough Bread', quantity: '1 loaf', checked: false },
              { name: 'Bananas', quantity: '1 bunch', checked: false },
              { name: 'Almond Milk (unsweetened)', quantity: '1/2 gal', checked: false },
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Kroger cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (showConnectModal) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-10">
        <div className="bg-white rounded-2xl shadow-lg max-w-[480px] w-full p-10 border border-gray-200 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🛒</div>
            <h2 className="text-xl font-bold text-gray-900">Connect Kroger</h2>
            <p className="text-sm text-gray-500">Simplifi AI will sync your shopping lists and enable smart grocery automations.</p>
          </div>

          <p className="text-[0.8125rem] font-semibold text-gray-700 mb-3">Permissions required:</p>
          <div className="space-y-0 mb-7">
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
              <span className="text-base">📋</span>
              <div className="text-sm text-gray-700">View and manage <strong>shopping lists</strong></div>
            </div>
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
              <span className="text-base">📍</span>
              <div className="text-sm text-gray-700">Access <strong>store preferences</strong> (pickup/delivery locations)</div>
            </div>
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
              <span className="text-base">🔄</span>
              <div className="text-sm text-gray-700">View <strong>order history</strong> for recurring item suggestions</div>
            </div>
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 border-none">
              <span className="text-base">❤️</span>
              <div className="text-sm text-gray-700">Access <strong>favorites & past purchases</strong></div>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button onClick={() => setShowConnectModal(false)} className="flex-1 py-3 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">Cancel</button>
            <button onClick={() => { setIsConnected(true); setShowConnectModal(false); }} className="flex-2 py-3 rounded-lg text-sm font-semibold bg-[#0A7E8C] text-white hover:bg-[#075B66] transition-all shadow-md">✦ Connect Kroger</button>
          </div>
          <div className="text-center mt-3.5 text-[0.75rem] text-gray-400">Your credentials are encrypted. <span className="text-[#0A7E8C] cursor-pointer">Learn more</span></div>
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">🛒 Kroger Grocery Run</h1>
          <p className="text-sm text-gray-500 mt-1">Simplifi AI prepared this for you based on your meal plan and favorites</p>
        </div>
        <div className="flex gap-2.5 items-center">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-[0.8125rem] font-medium hover:border-gray-400 hover:bg-gray-50 transition-all">📋 Edit List</button>
          <button className="bg-[#0A7E8C] text-white px-4 py-2 rounded-lg text-[0.8125rem] font-medium hover:bg-[#075B66] transition-all shadow-sm">✦ Schedule Pickup</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-all">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[0.9375rem] font-semibold text-gray-800 flex items-center gap-2">🧾 Shopping List</h3>
            <span className="text-xs text-[#0A7E8C] font-medium cursor-pointer hover:text-[#075B66]">Reorder by aisle</span>
          </div>
          <div className="p-5">
            <div className="space-y-0">
              {items.map((item, index) => (
                <div key={index} className={`flex items-center gap-2.5 py-2 ${index !== items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <input type="checkbox" defaultChecked={item.checked} className="accent-[#0A7E8C] w-4 h-4" />
                  <span className={`text-[0.8125rem] flex-1 ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.name}</span>
                  <span className="text-[0.6875rem] text-gray-400">{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-[0.75rem] text-gray-500 flex justify-between">
              <span>+ <span className="cursor-pointer text-[#0A7E8C] hover:underline">Add item</span></span>
              <span><strong>7 items</strong> · Estimated $32.50</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-all">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[0.9375rem] font-semibold text-gray-800 flex items-center gap-2">⚡ Automations Active</h3>
            <span className="text-xs text-[#0A7E8C] font-medium cursor-pointer hover:text-[#075B66]">Configure</span>
          </div>
          <div className="p-5 space-y-3.5">
            <div className="flex items-start gap-4 py-3.5 border-b border-gray-50 last:border-none">
              <div className="w-7 h-7 rounded-full bg-[#E6F7EC] text-[#38A169] flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">1</div>
              <div className="flex-1">
                <div className="text-[0.875rem] font-medium text-gray-800">✔️ Weekly meal plan → shopping list</div>
                <div className="text-[0.75rem] text-gray-500 mt-0.5">AI converts your meal plan to a Kroger list every Thursday</div>
              </div>
            </div>
            <div className="flex items-start gap-4 py-3.5 border-b border-gray-50 last:border-none">
              <div className="w-7 h-7 rounded-full bg-[#E6F7EC] text-[#38A169] flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">2</div>
              <div className="flex-1">
                <div className="text-[0.875rem] font-medium text-gray-800">✔️ Auto-schedule pickup slot</div>
                <div className="text-[0.75rem] text-gray-500 mt-0.5">Finds the best time based on your calendar and preferred store</div>
              </div>
            </div>
            <div className="flex items-start gap-4 py-3.5 border-b border-gray-50 last:border-none">
              <div className="w-7 h-7 rounded-full bg-[#E6F7EC] text-[#38A169] flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">3</div>
              <div className="flex-1">
                <div className="text-[0.875rem] font-medium text-gray-800">✔️ Remind before cutoff</div>
                <div className="text-[0.75rem] text-gray-500 mt-0.5">Notifies you 2 hours before the pickup cutoff time</div>
              </div>
            </div>
            <div className="flex items-start gap-4 py-3.5 last:border-none">
              <div className="w-7 h-7 rounded-full bg-[#E0F2F4] text-[#0A7E8C] flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">4</div>
              <div className="flex-1">
                <div className="text-[0.875rem] font-medium text-gray-800">Reorder favorites</div>
                <div className="text-[0.75rem] text-gray-500 mt-0.5">AI learns your regular purchases and auto-adds them</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
