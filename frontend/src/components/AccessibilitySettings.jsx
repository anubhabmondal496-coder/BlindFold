import React, { useState } from 'react';

export default function AccessibilitySettings({
  vibrationStrength,
  setVibrationStrength,
  speechRate,
  setSpeechRate,
  hapticEnabled,
  setHapticEnabled,
  voiceEnabled,
  setVoiceEnabled,
  onSpeak,
  onVibrate
}) {
  const [testStatus, setTestStatus] = useState('Tap button above to pulse device motor');

  const handleTestVibration = () => {
    let vibePattern = [150, 80, 150];
    if (vibrationStrength === 'gentle') vibePattern = [70, 40, 70];
    if (vibrationStrength === 'strong') vibePattern = [250, 100, 250, 100, 250];

    onVibrate(vibePattern);
    onSpeak(`Haptic motor pulsed with ${vibrationStrength} intensity.`);
    setTestStatus(`Pulsed: ${vibrationStrength.toUpperCase()} vibration`);
    setTimeout(() => {
      setTestStatus('Tap button above to pulse device motor');
    }, 2500);
  };

  const handleSelectStrength = (strength) => {
    setVibrationStrength(strength);
    let pattern = [120];
    if (strength === 'gentle') pattern = [60];
    if (strength === 'strong') pattern = [250];
    onVibrate(pattern);
    onSpeak(`Vibration strength set to ${strength}.`);
  };

  const handleSelectSpeechRate = (rate) => {
    setSpeechRate(rate);
    onVibrate([60]);
    onSpeak(`Speech speed set to ${rate}x.`);
  };

  return (
    <div className="flex flex-col w-full pb-32 space-y-6 max-w-2xl mx-auto select-none">
      {/* Header Intro Badge */}
      <div className="flex flex-col gap-1">
        <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg bg-surface-container-high border-2 border-tactile-slate">
          <span className="material-symbols-outlined text-tactile-slate text-[20px] filled">tune</span>
          <span className="text-xs font-black text-tactile-slate uppercase tracking-wider">
            Haptic & Tactile Core
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-tactile-slate tracking-tight">
          Accessibility & Device Controls
        </h1>
        <p className="text-sm sm:text-base font-bold text-on-surface-variant">
          Calibrate tactile vibration pulses and speech pacing for eyes-free navigation.
        </p>
      </div>

      {/* SECTION 1: HAPTIC & VIBRATION ENGINE */}
      <section aria-labelledby="haptic-settings-heading" className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-tactile-slate flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">vibration</span>
          </div>
          <h2 className="text-xl font-black text-tactile-slate" id="haptic-settings-heading">
            1. Haptic & Vibration Engine
          </h2>
        </div>

        {/* Live Test Vibration Tactile Button */}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={handleTestVibration}
            aria-label="Press to test phone vibration and trigger physical tactile pulse"
            className="w-full min-h-[72px] px-4 py-3 rounded-xl bg-secondary-container text-on-surface border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[32px] text-tactile-slate">vibration</span>
            <span className="text-lg font-black text-tactile-slate uppercase tracking-wide">
              Press to Test Vibration
            </span>
          </button>
          <div aria-live="polite" className="text-center text-xs font-bold text-on-surface-variant h-5 mt-1">
            {testStatus}
          </div>
        </div>

        {/* Vibration Intensity Selector */}
        <fieldset className="flex flex-col gap-2.5 bg-surface-container-lowest p-4 rounded-xl border-2 border-tactile-slate shadow-[0_3px_0_#0F172A]">
          <legend className="text-base font-black text-tactile-slate uppercase px-1">
            Vibration Strength
          </legend>
          <p className="text-xs sm:text-sm font-bold text-on-surface-variant mb-1">
            Select tactile motor force level:
          </p>

          <div className="flex flex-col gap-2" role="radiogroup">
            {[
              { id: 'gentle', label: 'GENTLE', desc: 'Soft tick, battery efficient', icon: 'water_drop' },
              { id: 'normal', label: 'NORMAL', desc: 'Balanced pulse for walking', icon: 'waves' },
              { id: 'strong', label: 'STRONG (MAX BUZZ)', desc: 'High-impact for noisy outdoor streets', icon: 'bolt' },
            ].map((opt) => {
              const isSelected = vibrationStrength === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectStrength(opt.id)}
                  className={`w-full min-h-[64px] px-4 rounded-xl border-2 border-tactile-slate flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-tactile-slate text-white shadow-[0_3px_0_#0F172A]'
                      : 'bg-surface-container-lowest text-tactile-slate hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[26px]">{opt.icon}</span>
                    <div className="flex flex-col text-left">
                      <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-tactile-slate'}`}>
                        {opt.label}
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-gray-300' : 'text-on-surface-variant'}`}>
                        {opt.desc}
                      </span>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-[26px] ${isSelected ? 'text-secondary-container filled' : 'text-transparent'}`}>
                    check_circle
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </section>

      {/* SECTION 2: SPEECH PACING */}
      <section aria-labelledby="speech-settings-heading" className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-tactile-slate flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
          </div>
          <h2 className="text-xl font-black text-tactile-slate" id="speech-settings-heading">
            2. Voice Announcements & Speed
          </h2>
        </div>

        <fieldset className="flex flex-col gap-3 bg-surface-container-lowest p-4 rounded-xl border-2 border-tactile-slate shadow-[0_3px_0_#0F172A]">
          <legend className="text-base font-black text-tactile-slate uppercase px-1">
            Speech Rate Pacing
          </legend>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { rate: 0.8, label: '0.8x Slow' },
              { rate: 1.0, label: '1.0x Normal' },
              { rate: 1.25, label: '1.25x Fast' },
              { rate: 1.5, label: '1.5x Rapid' },
            ].map((item) => {
              const isSelected = speechRate === item.rate;
              return (
                <button
                  key={item.rate}
                  type="button"
                  onClick={() => handleSelectSpeechRate(item.rate)}
                  className={`min-h-[56px] py-2 px-3 rounded-xl border-2 border-tactile-slate font-black text-sm uppercase flex items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-secondary-container text-on-surface shadow-[0_3px_0_#0F172A]'
                      : 'bg-surface-container text-tactile-slate hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-outline-variant">
            <span className="text-sm font-bold text-on-surface">Voice Guidance Toggle:</span>
            <button
              type="button"
              onClick={() => {
                const nextVal = !voiceEnabled;
                setVoiceEnabled(nextVal);
                if (nextVal) onSpeak("Voice announcements enabled.");
              }}
              className={`px-4 py-2 rounded-lg border-2 border-tactile-slate font-black text-sm transition-colors ${
                voiceEnabled ? 'bg-secondary-container text-on-surface' : 'bg-surface-container-highest text-outline'
              }`}
            >
              {voiceEnabled ? 'VOICE ON' : 'VOICE MUTED'}
            </button>
          </div>
        </fieldset>
      </section>

      {/* SECTION 3: TACTILE BUZZ DICTIONARY */}
      <section aria-label="Tactile Buzz Dictionary Reference" className="bg-surface-container-low rounded-xl p-4 border-2 border-tactile-slate shadow-[0_4px_0_#0F172A] flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tactile-slate text-[24px]">menu_book</span>
          <h3 className="text-xl font-black text-tactile-slate uppercase tracking-wide">
            Tactile Buzz Dictionary
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-bold text-on-surface-variant">
          Memorize these physical patterns while navigating:
        </p>

        <ul className="flex flex-col gap-2 mt-1" role="list">
          {[
            { buzz: "1 Short Buzz", desc: "Path ahead is clear. Keep proceeding forward.", icon: "check_circle" },
            { buzz: "2 Distinct Buzzes", desc: "Object or person detected within 3 metres. Proceed slowly.", icon: "warning" },
            { buzz: "3 Heavy Pulses", desc: "Urgent collision danger (<1m) or low overhead branch!", icon: "emergency" },
            { buzz: "5 Long Pulses", desc: "₹500 Indian Rupee note detected and confirmed.", icon: "currency_rupee" },
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg border-2 border-outline-variant">
              <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5 shrink-0">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-black text-tactile-slate">
                  {item.buzz}
                </span>
                <span className="text-xs sm:text-sm font-bold text-on-surface-variant">
                  {item.desc}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
