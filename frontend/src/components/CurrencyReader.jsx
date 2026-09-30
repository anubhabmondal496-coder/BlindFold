import React, { useState } from 'react';

export default function CurrencyReader({ onSpeak, onVibrate }) {
  const currencyNotes = [
    {
      denomination: 500,
      label: "₹500 RUPEES",
      spokenText: "Five hundred rupees detected. Valid Indian banknote.",
      width: "150 mm",
      height: "66 mm",
      pulses: 5,
      pulseDescription: "5 Long Vibrations Emitted (5 x ₹100)",
      colorName: "Stone Grey",
      bgGradient: "from-slate-700 to-slate-900",
      accent: "text-amber-300",
      vibe: [200, 100, 200, 100, 200, 100, 200, 100, 200]
    },
    {
      denomination: 200,
      label: "₹200 RUPEES",
      spokenText: "Two hundred rupees detected. Valid Indian banknote.",
      width: "146 mm",
      height: "66 mm",
      pulses: 2,
      pulseDescription: "2 Long Vibrations Emitted (2 x ₹100)",
      colorName: "Bright Orange",
      bgGradient: "from-amber-600 to-orange-800",
      accent: "text-yellow-200",
      vibe: [250, 120, 250]
    },
    {
      denomination: 100,
      label: "₹100 RUPEES",
      spokenText: "One hundred rupees detected. Valid Indian banknote.",
      width: "142 mm",
      height: "66 mm",
      pulses: 1,
      pulseDescription: "1 Long Vibration Emitted (1 x ₹100)",
      colorName: "Lavender",
      bgGradient: "from-indigo-600 to-purple-900",
      accent: "text-indigo-200",
      vibe: [300]
    },
    {
      denomination: 50,
      label: "₹50 RUPEES",
      spokenText: "Fifty rupees detected. Valid Indian banknote.",
      width: "135 mm",
      height: "66 mm",
      pulses: 1,
      pulseDescription: "1 Short Vibration Emitted (Sub-₹100 note)",
      colorName: "Fluorescent Blue",
      bgGradient: "from-cyan-600 to-blue-800",
      accent: "text-cyan-200",
      vibe: [100]
    },
    {
      denomination: 20,
      label: "₹20 RUPEES",
      spokenText: "Twenty rupees detected. Valid Indian banknote.",
      width: "129 mm",
      height: "63 mm",
      pulses: 2,
      pulseDescription: "2 Short Rapid Ticks",
      colorName: "Greenish Yellow",
      bgGradient: "from-lime-600 to-green-800",
      accent: "text-lime-200",
      vibe: [80, 50, 80]
    },
    {
      denomination: 10,
      label: "₹10 RUPEES",
      spokenText: "Ten rupees detected. Valid Indian banknote.",
      width: "123 mm",
      height: "63 mm",
      pulses: 1,
      pulseDescription: "1 Short Quick Tick",
      colorName: "Chocolate Brown",
      bgGradient: "from-amber-800 to-stone-900",
      accent: "text-amber-200",
      vibe: [80]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentNote = currencyNotes[currentIndex];

  const handleSpeakNote = () => {
    onSpeak(currentNote.spokenText);
    onVibrate(currentNote.vibe);
  };

  const handleNextNote = () => {
    const nextIdx = (currentIndex + 1) % currencyNotes.length;
    setCurrentIndex(nextIdx);
    const note = currencyNotes[nextIdx];
    onSpeak(note.spokenText);
    onVibrate(note.vibe);
  };

  return (
    <div className="flex flex-col w-full pb-32 space-y-4 max-w-2xl mx-auto select-none">
      {/* Screen Reader live announcement */}
      <div aria-live="assertive" className="sr-only">
        {currentNote.spokenText}. {currentNote.pulseDescription}. Tap anywhere to hear again.
      </div>

      {/* Header Guidance Directive */}
      <section aria-label="Camera Guidance" className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full bg-secondary-container animate-pulse"></span>
          <span className="text-sm font-black uppercase tracking-wider text-secondary">
            Currency Scanner Active
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface leading-tight tracking-tight">
          Hold note in front of camera
        </h1>
        <p className="text-sm sm:text-base font-bold text-on-surface-variant">
          Keep your fingers clear of the note edges for instant tactile detection.
        </p>
      </section>

      {/* Clean Camera Viewfinder Frame with Alignment Guides */}
      <div 
        aria-label="Camera Viewfinder: Recognition successful"
        className="relative w-full rounded-xl bg-surface-container overflow-hidden border-2 border-tactile-slate shadow-[0_4px_0_#0F172A]"
      >
        <div className="relative w-full aspect-[4/3] bg-surface-container-high flex items-center justify-center p-4 overflow-hidden">
          {/* Real simulated banknote graphics */}
          <div className={`w-full max-w-sm h-40 rounded-xl bg-gradient-to-r ${currentNote.bgGradient} p-4 text-white flex flex-col justify-between shadow-2xl relative border-2 border-white/20 select-none`}>
            {/* Top row */}
            <div className="flex justify-between items-start text-xs font-bold tracking-wider opacity-90">
              <span>RESERVE BANK OF INDIA</span>
              <span className="font-mono bg-black/40 px-1.5 py-0.5 rounded">7AB 492108</span>
            </div>

            {/* Middle row */}
            <div className="flex justify-between items-center my-auto">
              <div className="w-12 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-[32px] opacity-80">face</span>
              </div>
              <div className="text-right">
                <span className={`text-4xl font-black ${currentNote.accent}`}>
                  ₹{currentNote.denomination}
                </span>
                <p className="text-[10px] font-bold tracking-widest opacity-75">BHARAT • RBI</p>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-end text-[11px] font-bold">
              <span>Mahatma Gandhi Series</span>
              <span className="uppercase text-amber-300">{currentNote.colorName}</span>
            </div>

            {/* Security Thread line */}
            <div className="absolute top-0 bottom-0 left-[62%] w-2 bg-gradient-to-b from-amber-400 via-emerald-400 to-cyan-400 opacity-70 flex items-center justify-center pointer-events-none">
              <span className="text-[7px] font-black text-black rotate-90 tracking-tighter">RBI</span>
            </div>
          </div>

          {/* Tactile Framing Overlay */}
          <div className="absolute inset-3 rounded-lg pointer-events-none flex flex-col justify-between p-3 border-4 border-tactile-slate">
            {/* Top status */}
            <div className="flex justify-between items-center w-full">
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-surface text-on-surface text-xs font-black border-2 border-tactile-slate shadow-sm">
                <span className="material-symbols-outlined text-primary text-[18px] mr-1">center_focus_strong</span>
                LOCKED ON
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-surface text-on-surface text-xs font-black border-2 border-tactile-slate shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[18px] mr-1">light_mode</span>
                GOOD LIGHT
              </span>
            </div>

            {/* Center verification badge */}
            <div className="self-center bg-surface-container-lowest px-4 py-1.5 rounded-xl border-2 border-tactile-slate shadow-[0_3px_0_#0F172A]">
              <span className="text-sm font-black uppercase text-on-surface">
                Recognized: ₹{currentNote.denomination} Note
              </span>
            </div>

            {/* Bottom dimensions */}
            <div className="w-full flex justify-between items-end text-xs font-black">
              <div className="bg-surface text-on-surface px-2.5 py-1 rounded border-2 border-tactile-slate">
                W: {currentNote.width}
              </div>
              <div className="bg-surface text-on-surface px-2.5 py-1 rounded border-2 border-tactile-slate">
                H: {currentNote.height}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Result Card (Massive High-Contrast Readout) */}
      <section 
        aria-labelledby="detection-result-title"
        className="flex flex-col w-full rounded-xl bg-surface-container-lowest p-4 sm:p-5 space-y-4 border-2 border-tactile-slate shadow-[0_4px_0_#0F172A]"
      >
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-secondary uppercase tracking-wider">
              Confirmed Currency
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary-container text-on-surface text-xs font-black border-2 border-tactile-slate">
              <span className="material-symbols-outlined text-[18px] mr-1 filled">verified</span>
              100% Match
            </span>
          </div>

          <div 
            id="detection-result-title"
            className="text-4xl sm:text-5xl font-black text-on-surface tracking-tight"
          >
            {currentNote.label}
          </div>
          <div className="text-base sm:text-lg font-black text-on-surface uppercase tracking-wide">
            {currentNote.spokenText}
          </div>
        </div>

        {/* Haptic Sensory Vibration Visualizer */}
        <div className="flex flex-col rounded-xl bg-surface-container p-3 space-y-2 border-2 border-tactile-slate shadow-[0_2px_0_#0F172A]">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary border-2 border-tactile-slate">
              <span className="material-symbols-outlined text-[24px]">vibration</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-on-surface">Tactile Pulse Pattern</span>
              <span className="text-xs sm:text-sm font-bold text-secondary">{currentNote.pulseDescription}</span>
            </div>
          </div>

          {/* Pulse Visualizer Bars */}
          <div aria-label={`Visual representation: ${currentNote.pulses} pulses`} className="flex items-center space-x-2 pt-1">
            {Array.from({ length: currentNote.pulses }).map((_, i) => (
              <div 
                key={i}
                className="flex-1 h-5 rounded-md bg-secondary-container border border-tactile-slate animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
                title={`Pulse ${i + 1}`}
              />
            ))}
          </div>

          <p className="text-xs sm:text-sm font-bold text-on-surface-variant">
            Each vibration pulse represents an increment. Count pulses with your palm to verify without sight.
          </p>
        </div>

        {/* Action Buttons: Hear Aloud & Test Next Note */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleSpeakNote}
            aria-label={`Hear denomination aloud: ${currentNote.label}`}
            className="flex-1 min-h-[64px] bg-tactile-slate text-white text-lg font-black rounded-xl border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2 px-4 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[32px] text-secondary-container filled">volume_up</span>
            <span>Hear Amount Aloud</span>
          </button>

          <button
            type="button"
            onClick={handleNextNote}
            aria-label="Scan or test next currency note denomination"
            className="min-h-[64px] px-6 bg-secondary-container active:bg-secondary text-on-surface text-base sm:text-lg font-black rounded-xl border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px]">sync</span>
            <span>Next Note</span>
          </button>
        </div>
      </section>
    </div>
  );
}
