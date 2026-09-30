import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import WalkingHome from './components/WalkingHome';
import LiveWalkingHUD from './components/LiveWalkingHUD';
import CurrencyReader from './components/CurrencyReader';
import DetectionHistory from './components/DetectionHistory';
import AccessibilitySettings from './components/AccessibilitySettings';

export default function App() {
  const [currentTab, setTab] = useState('walking');
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [vibrationStrength, setVibrationStrength] = useState('normal');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [vibeIndicator, setVibeIndicator] = useState(false);

  // Audio Speech synthesis helper
  const speak = (text) => {
    if (!voiceEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Tactile Vibration helper with desktop visual indicator
  const vibrate = (pattern) => {
    if (!hapticEnabled) return;

    // Pulse screen vibration indicator bar
    setVibeIndicator(true);
    setTimeout(() => setVibeIndicator(false), 300);

    if (navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore if restricted
      }
    }
  };

  // Announce tab changes
  const handleTabChange = (label) => {
    speak(`${label} tab activated.`);
    vibrate([60]);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      {/* Visual Haptic Pulse Banner (for desktop & mobile visual feedback) */}
      <div 
        className={`fixed top-0 left-0 right-0 h-1.5 z-[100] transition-opacity duration-150 ${
          vibeIndicator ? 'opacity-100 bg-secondary-container' : 'opacity-0'
        }`}
      />

      {/* Tactile High-Contrast Light Header */}
      <Header
        hapticEnabled={hapticEnabled}
        voiceEnabled={voiceEnabled}
        batteryLevel={88}
        onOpenSettings={() => {
          setTab('settings');
          speak("Settings opened.");
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-24 px-4 max-w-2xl mx-auto flex flex-col">
        {currentTab === 'walking' && (
          <WalkingHome
            onStartWalking={() => {
              setTab('live-walking');
              vibrate([100, 50, 100]);
            }}
            onCheckCurrency={() => {
              setTab('currency');
              speak("Currency Reader activated.");
              vibrate([80]);
            }}
            onSpeak={speak}
            onVibrate={vibrate}
            vibrationStrength={vibrationStrength}
          />
        )}

        {currentTab === 'live-walking' && (
          <LiveWalkingHUD
            onExit={() => {
              setTab('walking');
              speak("Exited walking mode. Returned to main menu.");
              vibrate([100]);
            }}
            onSpeak={speak}
            onVibrate={vibrate}
          />
        )}

        {currentTab === 'currency' && (
          <CurrencyReader
            onSpeak={speak}
            onVibrate={vibrate}
          />
        )}

        {currentTab === 'history' && (
          <DetectionHistory
            onSpeak={speak}
            onVibrate={vibrate}
          />
        )}

        {currentTab === 'settings' && (
          <AccessibilitySettings
            vibrationStrength={vibrationStrength}
            setVibrationStrength={setVibrationStrength}
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
            hapticEnabled={hapticEnabled}
            setHapticEnabled={setHapticEnabled}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            onSpeak={speak}
            onVibrate={vibrate}
          />
        )}
      </main>

      {/* High-Contrast Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        setTab={setTab}
        onTabClick={handleTabChange}
      />
    </div>
  );
}
