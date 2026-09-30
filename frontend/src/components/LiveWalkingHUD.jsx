import React, { useState, useEffect, useRef } from 'react';

export default function LiveWalkingHUD({ onExit, onSpeak, onVibrate }) {
  const [isPaused, setIsPaused] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectionIndex, setDetectionIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const videoRef = useRef(null);

  const detections = [
    {
      title: "Person Ahead",
      distance: "5 Metres",
      vibePattern: "2 Rapid Buzzes",
      advice: "Obstacle detected directly in walking path. Step slightly right.",
      speech: "Person ahead at 5 metres. Proceed slowly or step right.",
      vibe: [120, 60, 120]
    },
    {
      title: "Clear Path Ahead",
      distance: "8 Metres",
      vibePattern: "1 Gentle Pulse",
      advice: "Pathway is unobstructed for the next 8 steps.",
      speech: "Path clear ahead. Walk freely.",
      vibe: [80]
    },
    {
      title: "Low Tree Branch",
      distance: "2.4 Metres",
      vibePattern: "3 Heavy Pulses",
      advice: "Head height hazard detected. Duck or veer left.",
      speech: "Warning! Head-level obstacle 2.4 metres ahead.",
      vibe: [250, 100, 250, 100, 250]
    }
  ];

  const currentDetection = detections[detectionIndex];

  // Try opening real user camera if supported
  useEffect(() => {
    let stream = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setCameraActive(true);
          }
        })
        .catch(() => {
          // Camera permission denied or not available; fallback gracefully to simulated high-contrast photo
          setCameraActive(false);
        });
    }

    // Initial announcement
    onSpeak("Walking navigation active. Camera scanning forward.");
    onVibrate([100, 50, 100]);

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const handleTapAnywhere = () => {
    const text = isPaused
      ? "Walking mode is currently paused."
      : `${currentDetection.title}. Distance: ${currentDetection.distance}. ${currentDetection.advice}`;
    onSpeak(text);
    onVibrate(currentDetection.vibe);
    showToast(`Status: ${currentDetection.title} (${currentDetection.distance})`);
  };

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      onSpeak("Walking guidance resumed.");
      onVibrate([100]);
    } else {
      setIsPaused(true);
      onSpeak("Walking guidance paused.");
      onVibrate([200]);
    }
  };

  const handleRecheckPath = () => {
    const nextIdx = (detectionIndex + 1) % detections.length;
    setDetectionIndex(nextIdx);
    const d = detections[nextIdx];
    onSpeak(`Re-checking path. ${d.title}. Distance: ${d.distance}.`);
    onVibrate(d.vibe);
    showToast(`Re-checked: ${d.title}`);
  };

  return (
    <div className="flex flex-col w-full pb-32 space-y-4 max-w-2xl mx-auto select-none">
      {/* Screen Reader Live Region */}
      <div aria-live="assertive" className="sr-only">
        {currentDetection.title}. Distance {currentDetection.distance}. {currentDetection.advice}
      </div>

      {/* Top Action Bar: Exit & Live Active Status */}
      <section aria-label="Status Bar and Exit Action" className="w-full">
        <div className="flex items-stretch justify-between gap-3 w-full">
          <button
            id="btn-exit"
            type="button"
            onClick={onExit}
            aria-label="Exit Walking Mode and return to main menu"
            className="h-20 px-4 sm:px-6 bg-surface-container-highest text-on-surface rounded-xl border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 flex-1 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[36px]">arrow_back</span>
            <span className="text-xl sm:text-2xl font-black uppercase tracking-wider">
              Exit Walking
            </span>
          </button>

          <div className="h-20 px-4 sm:px-6 bg-secondary-container text-on-surface rounded-xl border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[32px] animate-pulse text-on-surface filled">
              sensors
            </span>
            <span className="text-sm sm:text-base uppercase font-black tracking-wide">
              {isPaused ? 'PAUSED' : 'LIVE ACTIVE'}
            </span>
          </div>
        </div>
      </section>

      {/* Camera Feed & Immediate Detection Readout */}
      <section aria-label="Obstacle Detection Feed and Readout" className="flex flex-col gap-3 w-full">
        <div className="relative w-full rounded-xl overflow-hidden bg-surface-container border-2 border-tactile-slate shadow-[0_4px_0_#0F172A]">
          {/* Live Video or Grounded Photo */}
          <div className="relative w-full h-64 bg-surface-container-high overflow-hidden flex items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3tUyRujyf-YDbrExAsFCry6tXup3zD5P1d-jjr-Od5aiolV8onUaNOrHIniOb41EdUPkLQ9DrtHqo_SEMVnjIVNBtOQny38KIxXSAtGHCQRWf0JMcdh3Et1OcPGkLRPTA2T29bI6el9Aa8mQN3uYls8U5UpdB7GQHbmarwhHGcvE3DY-CAFSviFOPK5C-xBDn39JVBT2EDmdnb8lLLQaTe4TlDiPJ8GE74TkteoBKU9QX1-rXGoZkBA"
                alt="Pedestrian sidewalk forward view"
                className="w-full h-full object-cover"
              />
            )}

            {/* Sweep radar scanline */}
            {!isPaused && (
              <div 
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-90 animate-pulse pointer-events-none"
                style={{ animationDuration: '2s' }}
              />
            )}

            {/* Bounding Box HUD */}
            <div className="absolute inset-10 border-4 border-dashed border-tactile-slate rounded-lg flex items-center justify-center pointer-events-none bg-primary/5">
              <span className="bg-tactile-slate text-white px-3 py-1 rounded font-black text-sm uppercase">
                {currentDetection.title} • {currentDetection.distance}
              </span>
            </div>
          </div>

          {/* Immediate Detection Readout Card */}
          <div className="p-4 bg-surface-container-lowest text-on-surface flex flex-col gap-1 text-center">
            <span className="text-sm font-black text-secondary uppercase tracking-widest">
              Immediate Detection
            </span>
            <h2 className="text-3xl font-black text-tactile-slate uppercase tracking-tight">
              {currentDetection.title}
            </h2>
            <div className="inline-flex items-center justify-center gap-2 bg-surface-container-highest text-on-surface py-2 px-6 rounded-xl mx-auto border-2 border-tactile-slate mt-1 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">straighten</span>
              <span className="text-2xl font-black">{currentDetection.distance}</span>
            </div>
          </div>
        </div>

        {/* Vibration Pattern Guide Box */}
        <div 
          aria-label="Vibration pattern guide"
          className="w-full bg-surface-container-lowest rounded-xl p-4 border-2 border-tactile-slate shadow-[0_3px_0_#0F172A] flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-secondary-container text-on-surface border-2 border-tactile-slate flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[36px]">vibration</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xl font-black text-tactile-slate uppercase">
              {currentDetection.vibePattern}
            </span>
            <p className="text-sm sm:text-base font-bold text-on-surface mt-0.5">
              {currentDetection.advice}
            </p>
          </div>
        </div>
      </section>

      {/* Giant Touch Trigger Zone (140px min height) */}
      <section aria-label="Giant Touch Trigger Zone" className="w-full">
        <div
          role="button"
          tabIndex={0}
          onClick={handleTapAnywhere}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTapAnywhere(); }}
          aria-label="Massive tap target. Tap anywhere on this area to hear voice status and feel vibration pattern."
          className="w-full min-h-[140px] p-6 rounded-xl bg-tactile-slate text-white border-2 border-tactile-slate shadow-[0_6px_0_#0F172A] active:shadow-none active:translate-y-1.5 flex flex-col items-center justify-center text-center cursor-pointer transition-transform"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[42px] text-secondary-container">touch_app</span>
            <span className="material-symbols-outlined text-[38px] text-white">volume_up</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Tap Anywhere to Hear Status
          </span>
          <p className="text-sm sm:text-base font-bold text-primary-fixed mt-1 max-w-sm">
            Tap anywhere in this box to announce path conditions aloud.
          </p>
        </div>
      </section>

      {/* Primary Physical Controls: Pause & Re-Check */}
      <section aria-label="Primary Physical Controls" className="flex flex-col gap-3 w-full">
        <button
          id="btn-pause"
          type="button"
          onClick={handleTogglePause}
          aria-label={isPaused ? "Resume Walking Assistant" : "Pause Walking Assistant"}
          className="w-full min-h-[80px] p-4 rounded-xl bg-secondary-container text-on-surface border-2 border-tactile-slate shadow-[0_5px_0_#0F172A] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[42px] filled">
            {isPaused ? 'play_circle' : 'pause_circle'}
          </span>
          <span className="text-2xl font-black uppercase tracking-wider">
            {isPaused ? 'Resume Walking' : 'Pause Walking'}
          </span>
        </button>

        <button
          id="btn-recheck"
          type="button"
          onClick={handleRecheckPath}
          aria-label="Re-check Path Now. Triggers immediate spatial audio sweep."
          className="w-full min-h-[72px] p-4 rounded-xl bg-surface-container-highest text-on-surface border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[36px]">radar</span>
          <span className="text-xl sm:text-2xl font-black uppercase tracking-wide">
            Re-Check Path
          </span>
          <span className="material-symbols-outlined text-[32px] text-secondary">spatial_audio</span>
        </button>
      </section>

      {/* Tactile Toast Notification */}
      {toastMessage && (
        <div 
          aria-live="assertive"
          className="fixed bottom-28 left-4 right-4 max-w-xl mx-auto bg-tactile-slate text-white p-4 rounded-xl border-2 border-tactile-slate shadow-2xl flex items-center justify-between gap-3 z-50 animate-bounce"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] text-secondary-container">volume_up</span>
            <span className="text-base font-bold">{toastMessage}</span>
          </div>
          <span className="material-symbols-outlined text-[24px]">check</span>
        </div>
      )}
    </div>
  );
}
