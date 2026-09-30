import React, { useState } from 'react';

export default function WalkingHome({
  onStartWalking,
  onCheckCurrency,
  onSpeak,
  onVibrate,
  vibrationStrength,
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [motorStatus, setMotorStatus] = useState('Tap to pulse device motor');

  const sampleObstacles = [
    {
      title: "Person in front — approx. 5 metres",
      distance: "5 Metres",
      type: "person",
      caution: "Directly in your walking line",
      hapticNote: "2 Short Pulses (Safe to proceed slowly)",
      image: "/photos/test.webp",
      fallbackImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxmCsihsPjv5j-FBNCgZgCBzashMKBwGtaTVS3OfxEdTmWnIcLP-wmO5m088qzWvSbhft1OxSVgql2hAHrOFvQsHvgKIJZu3AJV5fWlWssb7hQRb9Zc94ZdLm8aR2RdEf4-ZZEono6bHRclVSgaJ1krQSmVAD1au0BF6qvmPkuGGlCDzZOo8RioL8e4GKdK8cY7F3oNBHo70PJI1oytFGE6JMriKSYUT3z-5u0Vqw1IelPDSKYnQ67vw",
      speech: "Person in front, approximately 5 metres ahead. Walking path partially clear."
    },
    {
      title: "Bench on right side — 3.2 metres",
      distance: "3.2 Metres",
      type: "bench",
      caution: "To your right side",
      hapticNote: "1 Short Pulse (Clear center path)",
      image: "/photos/bench.webp",
      fallbackImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoOB50cRAd_m4xwWyGkflKQwWVsx2v0YC-L3prAsfB5Lg_Z6FQNFGbPKUPMaF6wM90Vq5rdh0LeF1rHzn2V4adhyrjPZ6ss2-U6xGwfaimgcP6djR-qH21N1IKU_9_2m6dF9pJ_iF9wmb-8jYG16uXtyRUC7NlJ9pRoILcD3zs_e2Vb1J0RtKa-iURf-AtPTxITjtrKwJHrrtDe8SasOzLmGCvcVOxYj4ckuu8InvYQn-htBuNbRzOXQ",
      speech: "Bench detected 3 metres ahead to your right. Center path is clear."
    },
    {
      title: "Zebra Crossing detected — 4 metres",
      distance: "4 Metres",
      type: "zebra_crossing",
      caution: "Pedestrian road crossing ahead",
      hapticNote: "3 Quick Ticks (Intersection guide)",
      image: "/photos/zebra_crossing.webp",
      fallbackImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3tUyRujyf-YDbrExAsFCry6tXup3zD5P1d-jjr-Od5aiolV8onUaNOrHIniOb41EdUPkLQ9DrtHqo_SEMVnjIVNBtOQny38KIxXSAtGHCQRWf0JMcdh3Et1OcPGkLRPTA2T29bI6el9Aa8mQN3uYls8U5UpdB7GQHbmarwhHGcvE3DY-CAFSviFOPK5C-xBDn39JVBT2EDmdnb8lLLQaTe4TlDiPJ8GE74TkteoBKU9QX1-rXGoZkBA",
      speech: "Pedestrian zebra crossing 4 metres ahead. Prepare to cross when safe."
    }
  ];

  const currentObstacle = sampleObstacles[selectedPhotoIndex];

  const handleHearAnnouncement = () => {
    onSpeak(currentObstacle.speech);
    onVibrate([100, 60, 100]);
  };

  const handleTestMotor = () => {
    onVibrate([150, 80, 150]);
    onSpeak("Vibration motor verified.");
    setMotorStatus("Motor pulsed successfully!");
    setTimeout(() => {
      setMotorStatus("Tap to pulse device motor");
    }, 2500);
  };

  const cycleObstacle = () => {
    const nextIdx = (selectedPhotoIndex + 1) % sampleObstacles.length;
    setSelectedPhotoIndex(nextIdx);
    onSpeak(sampleObstacles[nextIdx].speech);
    onVibrate([80]);
  };

  return (
    <div className="flex flex-col w-full pb-32 space-y-4 max-w-2xl mx-auto">
      {/* Screen Reader polite status */}
      <div aria-live="polite" className="sr-only">
        Home screen ready. Walking assistant active. Obstacle detected: {currentObstacle.title}.
      </div>

      {/* 1. STATUS BANNER / TACTILE CARD */}
      <section 
        aria-label="System Operational Status" 
        className="w-full bg-surface-container-lowest rounded-xl p-4 tactile-card"
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-secondary-container animate-pulse"></span>
            <h2 className="text-xl font-black text-on-surface tracking-tight uppercase">
              Walking Assistant Ready
            </h2>
          </div>
          <span className="material-symbols-outlined text-on-surface text-[28px] filled">
            check_circle
          </span>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-start gap-2.5 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant">
            <span className="material-symbols-outlined text-secondary text-[26px] mt-0.5 shrink-0">
              vibration
            </span>
            <div>
              <p className="text-base font-bold text-on-surface">
                Vibration Alerts: <span className="text-secondary font-black">ACTIVE ({vibrationStrength.toUpperCase()})</span>
              </p>
              <p className="text-sm font-medium text-on-surface-variant">
                Phone will buzz continuously for upcoming obstacles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-surface-container-low px-2.5 py-2 rounded-lg border border-outline-variant">
            <span className="material-symbols-outlined text-primary text-[26px] shrink-0">
              volume_up
            </span>
            <p className="text-base font-bold text-on-surface">
              Voice Announcements: <span className="font-black text-on-surface">ON (Natural Speech)</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. LATEST DETECTION AND CAMERA FEED CARD */}
      <section 
        aria-label="Latest Detection and Camera Feed"
        className="w-full bg-surface-container-lowest rounded-xl p-4 tactile-card"
      >
        {/* Obstacle Alert Banner */}
        <div className="bg-secondary-container text-on-surface p-3 rounded-lg mb-3 flex items-center justify-between gap-2 border-2 border-tactile-slate shadow-[0_2px_0_#0F172A]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[32px] text-on-surface shrink-0 filled">
              warning
            </span>
            <div>
              <span className="text-lg font-black tracking-wide block uppercase leading-none">
                Obstacle Detected
              </span>
              <span className="text-xs sm:text-sm font-bold text-on-secondary-container">
                {currentObstacle.caution}
              </span>
            </div>
          </div>

          <button
            onClick={cycleObstacle}
            aria-label="Switch sample obstacle detection"
            className="px-2.5 py-1 bg-surface-container-lowest rounded-lg border-2 border-tactile-slate text-xs font-black uppercase text-on-surface hover:bg-surface-container active:scale-95 transition-transform"
          >
            Next Sample
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative w-full h-48 sm:h-52 rounded-lg overflow-hidden bg-surface-container border-2 border-tactile-slate mb-3">
          <img 
            src={currentObstacle.image}
            onError={(e) => { e.target.src = currentObstacle.fallbackImage; }}
            alt={`Camera view showing ${currentObstacle.title}`}
            className="w-full h-full object-cover"
          />

          {/* Grounded Visual Target Box */}
          <div className="absolute inset-x-8 top-6 bottom-4 rounded border-4 border-dashed border-tactile-slate bg-primary/10 flex items-end justify-center pb-2 pointer-events-none">
            <span className="bg-tactile-slate text-white text-xs sm:text-sm font-black px-2.5 py-1 rounded shadow">
              {currentObstacle.distance}
            </span>
          </div>
        </div>

        {/* Detection Details Stacking */}
        <div className="bg-surface-container-low p-3 rounded-lg mb-3 border border-outline-variant">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-[24px]">person</span>
            <p className="text-lg font-black text-on-surface">
              {currentObstacle.title}
            </p>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px] text-secondary">graphic_eq</span>
            <p className="text-sm font-bold">
              Haptic sent: <strong className="text-on-surface">{currentObstacle.hapticNote}</strong>
            </p>
          </div>
        </div>

        {/* Huge Replay Announcement Button (64px Min Touch Height) */}
        <button 
          id="replay-voice-btn"
          type="button"
          onClick={handleHearAnnouncement}
          aria-label={`Hear Announcement Again: ${currentObstacle.title}`}
          className="w-full min-h-[64px] bg-surface-container-high active:bg-surface-container-highest text-on-surface text-lg font-black rounded-xl border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 px-4 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[32px] text-primary filled">
            volume_up
          </span>
          <span>Hear Announcement Again</span>
        </button>
      </section>

      {/* 3. PRIMARY WORKFLOW ACTIONS (GIANT TACTILE BUTTONS) */}
      <section aria-label="Main Navigation Controls" className="w-full space-y-3">
        {/* Primary Giant Button: Start Walking Mode */}
        <button 
          id="start-walking-btn"
          type="button"
          onClick={onStartWalking}
          aria-label="Start Walking Mode. Press to start continuous vibration guidance."
          className="w-full min-h-[84px] bg-secondary-container active:bg-secondary text-on-surface rounded-xl border-2 border-tactile-slate shadow-[0_6px_0_#0F172A] active:shadow-none active:translate-y-1.5 flex items-center justify-between px-4 sm:px-6 text-left transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3 pr-2">
            <div className="w-14 h-14 rounded-xl bg-on-surface text-white flex items-center justify-center shrink-0 shadow">
              <span className="material-symbols-outlined text-[38px]">directions_walk</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-on-surface uppercase tracking-tight leading-tight">
                Start Walking Mode
              </span>
              <span className="text-sm sm:text-base font-bold text-on-surface">
                Continuous vibration & voice guidance
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <span className="material-symbols-outlined text-[32px] text-on-surface animate-bounce">
              vibration
            </span>
            <span className="text-xs font-black uppercase tracking-wider">BUZZ</span>
          </div>
        </button>

        {/* Secondary Giant Button: Currency Reader */}
        <button 
          id="check-currency-btn"
          type="button"
          onClick={onCheckCurrency}
          aria-label="Check Currency Rupee. Identify cash notes immediately."
          className="w-full min-h-[72px] bg-surface-container-lowest active:bg-surface-container-high text-on-surface rounded-xl border-2 border-tactile-slate shadow-[0_5px_0_#0F172A] active:shadow-none active:translate-y-1 flex items-center justify-between px-4 sm:px-6 text-left transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container text-on-surface flex items-center justify-center shrink-0 border-2 border-tactile-slate">
              <span className="text-2xl font-black">₹</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-on-surface uppercase tracking-tight leading-tight">
                Check Currency (₹)
              </span>
              <span className="text-sm font-bold text-on-surface-variant">
                Identify Indian Rupee banknotes
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[32px] text-tactile-slate">
            arrow_forward
          </span>
        </button>
      </section>

      {/* 4. MOTOR DIAGNOSTIC DOCK */}
      <section 
        aria-label="Haptic Diagnostic Feedback"
        className="w-full bg-surface-container-lowest rounded-xl p-3.5 border-2 border-tactile-slate shadow-[0_3px_0_#0F172A]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 pl-1">
            <span className="material-symbols-outlined text-secondary text-[28px]">touch_app</span>
            <div>
              <p className="text-base font-black text-on-surface leading-none">Motor Check</p>
              <p className="text-xs sm:text-sm font-bold text-on-surface-variant mt-0.5">{motorStatus}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestMotor}
            aria-label="Test Vibration Buzz. Triggers tactile phone pulse."
            className="min-h-[52px] px-4 bg-surface-container-high active:bg-tactile-slate active:text-white text-on-surface text-sm font-black rounded-lg border-2 border-tactile-slate shadow-[0_3px_0_#0F172A] active:translate-y-0.5 active:shadow-none flex items-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">vibration</span>
            <span>Test Buzz</span>
          </button>
        </div>
      </section>
    </div>
  );
}
