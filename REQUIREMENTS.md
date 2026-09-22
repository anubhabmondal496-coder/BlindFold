# Requirements Specification (REQUIREMENTS.md)

## Project: BlindFold (VisionMate)
**Target:** Fast, reliable assistive vision for daily indoor and outdoor navigation.

---

## 1. Functional Requirements

### Camera & Capture
- **FR-01:** Camera feed captures frames at 10–15 FPS with auto-focus and auto-exposure.
- **FR-02:** Automatically triggers the phone's flashlight if lighting drops below 30 Lux (e.g. entering a dark room or hallway).
- **FR-03:** Drops motion-blurred frames locally before running inference to save battery and network bandwidth.

### Obstacle Detection
- **FR-04:** Detects high-risk obstacles (chairs, doors, stairs, people, vehicles, low barriers) with ≥ 0.60 confidence score.
- **FR-05:** Splits the camera's view into 3 zones: **Left (0–33%)**, **Center (33–66%)**, and **Right (66–100%)**.
- **FR-06:** Categorizes distance using bounding box size:
  - *Far (>3m)*
  - *Approaching (1.5m–3m)*
  - *Immediate (<1.5m)*

### Currency Recognition
- **FR-07:** Recognizes Indian Rupee notes: ₹10, ₹20, ₹50, ₹100, ₹200, and ₹500.
- **FR-08:** Works reliably with folded, angled (up to 45°), or partially covered notes.

### Situational Text (Phase 2)
- **FR-09:** Reads high-priority signs (restroom markers, room numbers, exit signs, bus routes).
- **FR-10:** Prioritizes critical alert words ("Danger", "Exit", "Restroom") before reading surrounding text.

### Voice & Haptics
- **FR-11:** Speaks obstacle and currency results within 350ms of detection.
- **FR-12:** Priority audio interrupt: An immediate collision hazard alert immediately silences any background text reading.
- **FR-13:** Distinct vibration patterns (sharp double-buzz for hazard, long single-buzz for currency scan).
- **FR-14:** Adjustable TTS speech speed (1.0x up to 2.5x).

---

## 2. Non-Functional Requirements

### Performance & Latency
- **NFR-01:** End-to-end latency under **350ms** on local edge inference, under **600ms** on 4G/5G.
- **NFR-02:** Memory footprint under 250 MB RAM; runs 45 minutes continuously without overheating or throttling phone CPU.
- **NFR-03:** Inference runs at ≥ 15 FPS on a standard smartphone processor.

### Accessibility (A11y)
- **NFR-04:** Full support for Google TalkBack (Android) and Apple VoiceOver (iOS) with 100% accessible labels.
- **NFR-05:** Big tactile touch targets (minimum 96x96 dp) — screen split into 4 clear quadrants so users never have to hunt for small buttons.
- **NFR-06:** Audio levels boosted to cut through outdoor street and traffic noise (>75 dB).

### Privacy & Reliability
- **NFR-07 (Zero image storage):** No photos or camera video frames are saved to disk or cloud. Images exist only in memory during inference, then discarded.
- **NFR-08:** Offline fallback — if cell service drops, the app switches to local on-device TFLite models so the user isn't left stranded.

---

## 3. Practical Constraints & Assumptions

- **User Setup:** User has an Android (10+) or iOS (15+) phone with a working camera and uses single-ear or bone-conduction headphones (so one ear is always free to hear street sounds).
- **Compute:** Training runs on free/standard cloud GPUs (Google Colab / Kaggle). We're deliberately sticking to lightweight CNNs (<15M parameters) rather than massive 70B models that can't run cheaply or quickly.
- **Safety Note:** BlindFold is an assistive companion, **not** a replacement for a white cane or guide dog. The onboarding flow reminds users to keep using their cane as their primary physical feeler.
