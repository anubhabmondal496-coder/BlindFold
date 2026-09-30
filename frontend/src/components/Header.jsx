import React from 'react';

export default function Header({ hapticEnabled, voiceEnabled, batteryLevel = 88, onOpenSettings }) {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/95 backdrop-blur-xl border-b-2 border-tactile-slate shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <div className="h-20 px-4 max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-tactile-slate flex items-center justify-center shadow-[0_2px_0_#111c2d]">
            <span className="material-symbols-outlined text-tactile-amber text-[24px]">visibility</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-on-surface tracking-tight leading-none">BlindFold</span>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider mt-0.5">Tactile Vision Assist</span>
          </div>
        </div>

        {/* Status Indicators (Haptics, Voice, Battery) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={onOpenSettings}
            aria-label={`Haptics is ${hapticEnabled ? 'ON' : 'OFF'}. Click to configure in settings.`}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-tactile-slate text-xs font-bold transition-colors ${
              hapticEnabled ? 'bg-surface-container text-on-surface' : 'bg-surface-dim text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">vibration</span>
            <span className="hidden xs:inline">Haptics</span>
            <span>{hapticEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button 
            onClick={onOpenSettings}
            aria-label={`Voice is ${voiceEnabled ? 'ON' : 'OFF'}. Click to configure in settings.`}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-tactile-slate text-xs font-bold transition-colors ${
              voiceEnabled ? 'bg-surface-container text-on-surface' : 'bg-surface-dim text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">volume_up</span>
            <span className="hidden xs:inline">Voice</span>
            <span>{voiceEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <div 
            aria-label={`Battery level ${batteryLevel} percent`}
            className="flex items-center gap-1 px-2 py-1 bg-surface-container-high rounded-lg border-2 border-tactile-slate text-xs font-black text-on-surface"
          >
            <span className="material-symbols-outlined text-[17px]">battery_charging_80</span>
            <span>{batteryLevel}%</span>
          </div>
        </div>
      </div>
    </header>
  );
}
