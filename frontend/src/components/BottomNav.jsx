import React from 'react';

export default function BottomNav({ currentTab, setTab, onTabClick }) {
  const tabs = [
    { id: 'walking', label: 'Walking', icon: 'directions_walk' },
    { id: 'currency', label: 'Currency', icon: 'currency_rupee' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  const handleSelect = (id, label) => {
    setTab(id);
    if (onTabClick) onTabClick(label);
  };

  return (
    <nav 
      aria-label="Main Navigation Tabs"
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl border-t-2 border-tactile-slate shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="h-24 px-3 max-w-2xl mx-auto flex items-center justify-between gap-2" role="tablist">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id || (tab.id === 'walking' && currentTab === 'live-walking');
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={`${tab.label} Mode`}
              onClick={() => handleSelect(tab.id, tab.label)}
              className={`flex-1 min-h-[64px] h-[70px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all border-2 border-tactile-slate ${
                isActive
                  ? 'bg-secondary-container text-on-surface font-extrabold shadow-[0_3px_0_#0F172A] -translate-y-0.5'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[0_2px_0_#0F172A]'
              }`}
            >
              <span className={`material-symbols-outlined text-[30px] ${isActive ? 'filled' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-tight uppercase leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
