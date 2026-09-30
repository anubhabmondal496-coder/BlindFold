import React, { useState } from 'react';

export default function DetectionHistory({ onSpeak, onVibrate }) {
  const [filter, setFilter] = useState('all');

  const historyEvents = [
    {
      id: 1,
      category: 'hazards',
      badge: 'HAZARD ALERT',
      badgeClass: 'bg-error-container text-on-error-container',
      time: 'TODAY • 9:42 AM',
      title: 'Person Approaching — 7.4 m',
      subtitle: 'Walking mode • Approach speed 1.1 m/s • Warning sounded',
      vector: 'Vector: Direct Front',
      speech: 'Person approximately 7 metres ahead approaching at 1.1 metres per second.'
    },
    {
      id: 2,
      category: 'hazards',
      badge: 'DROP RISK',
      badgeClass: 'bg-secondary-container text-on-secondary-container',
      time: 'TODAY • 9:37 AM',
      title: 'Stairs — 3.1 m Ahead',
      subtitle: 'Downward staircase • 4 steps detected • High caution',
      vector: 'Vector: Direct Front Down',
      speech: 'Downward staircase 3 metres ahead. 4 steps detected. Slow down.'
    },
    {
      id: 3,
      category: 'currency',
      badge: 'CURRENCY VERIFIED',
      badgeClass: 'bg-secondary-container text-on-secondary-container',
      time: 'TODAY • 8:50 AM',
      title: '₹500 Rupee Note Confirmed',
      subtitle: 'Watermark intact • Security thread verified • Clean edges',
      vector: 'Camera View: Centered',
      speech: 'Five hundred rupees detected. Valid Indian banknote.'
    },
    {
      id: 4,
      category: 'obstacles',
      badge: 'OBSTACLE DETECTED',
      badgeClass: 'bg-surface-container-high text-on-surface',
      time: 'TODAY • 8:15 AM',
      title: 'Bench — 3.2 m to Right',
      subtitle: 'Walking mode • Side obstruction • Center path clear',
      vector: 'Vector: Right Flank',
      speech: 'Bench detected 3 metres ahead to your right. Center path clear.'
    }
  ];

  const filteredEvents = filter === 'all' 
    ? historyEvents 
    : historyEvents.filter(e => e.category === filter || (filter === 'obstacles' && e.category === 'hazards'));

  const handlePlaySummary = () => {
    onSpeak("Daily summary: 4 events logged today. 2 proximity hazards, 1 currency note verified, and 1 bench obstacle detected.");
    onVibrate([100, 50, 100]);
  };

  const handlePlayEvent = (event) => {
    onSpeak(event.speech);
    onVibrate([80, 40, 80]);
  };

  return (
    <div className="flex flex-col w-full pb-32 space-y-4 max-w-2xl mx-auto select-none">
      {/* Audio Overview Announcement Block */}
      <section aria-label="Audio summary overview" className="w-full">
        <button
          type="button"
          onClick={handlePlaySummary}
          aria-label="Hear Daily Summary. 4 events logged today. Tap to listen."
          className="w-full min-h-[72px] p-4 rounded-xl bg-surface-container-high text-on-surface border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] active:shadow-none active:translate-y-1 flex items-center justify-between gap-3 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-surface flex items-center justify-center shrink-0 border border-tactile-slate">
              <span className="material-symbols-outlined text-[30px] filled">volume_up</span>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xl font-black text-on-surface tracking-wide truncate">
                Hear Daily Summary
              </span>
              <span className="text-xs sm:text-sm font-bold text-secondary truncate">
                4 events logged today • Tap to listen
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-tactile-slate flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-tactile-slate text-[24px]">play_arrow</span>
          </div>
        </button>
      </section>

      {/* High-Contrast Category Filter Bar */}
      <section aria-label="Detection log category filters" className="w-full">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1" role="tablist">
          {[
            { id: 'all', label: 'All (4)', icon: 'dataset' },
            { id: 'obstacles', label: 'Obstacles (3)', icon: 'person_alert' },
            { id: 'currency', label: 'Currency (1)', icon: 'payments' },
            { id: 'hazards', label: 'Hazards (2)', icon: 'warning' },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(tab.id)}
                className={`min-h-[48px] px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 shrink-0 border-2 border-tactile-slate transition-all ${
                  isActive
                    ? 'bg-secondary-container text-on-surface shadow-[0_3px_0_#0F172A]'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Detection Event Cards */}
      <section aria-label="Logged detection timeline" className="flex flex-col w-full gap-3">
        {filteredEvents.map((evt) => (
          <article
            key={evt.id}
            className="w-full p-4 rounded-xl bg-surface-container-lowest text-on-surface border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-black uppercase border border-tactile-slate ${evt.badgeClass}`}>
                {evt.badge}
              </span>
              <span className="text-xs font-bold text-on-surface-variant">
                {evt.time}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl sm:text-2xl font-black text-tactile-slate">
                {evt.title}
              </h2>
              <p className="text-sm font-bold text-on-surface-variant">
                {evt.subtitle}
              </p>
            </div>

            <div className="text-xs font-black text-secondary uppercase bg-surface-container p-2 rounded-lg border border-outline-variant">
              {evt.vector}
            </div>

            {/* Audio Replay Trigger */}
            <button
              type="button"
              onClick={() => handlePlayEvent(evt)}
              aria-label={`Play audio recording for: ${evt.title}`}
              className="w-full min-h-[56px] px-4 py-2 rounded-xl bg-surface-container-high active:bg-tactile-slate active:text-white text-on-surface border-2 border-tactile-slate shadow-[0_2px_0_#0F172A] active:shadow-none active:translate-y-0.5 flex items-center justify-between gap-2 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[24px] text-secondary">volume_up</span>
                <span className="text-xs sm:text-sm font-bold truncate">Replay voice announcement</span>
              </div>
              <span className="material-symbols-outlined text-[24px]">play_circle</span>
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
