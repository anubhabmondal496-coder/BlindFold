# Project Roadmap (ROADMAP.md)

## Project: BlindFold (VisionMate)
**Timeline:** 8-week phased rollout from foundational MVP to real-world user testing.

---

## High-Level Milestone Overview

```
    [ Phase 1: Weeks 1-3 ]              [ Phase 2: Weeks 4-6 ]              [ Phase 3: Weeks 7-8 ]
          (Kenshi)                            (Samurai)                            (Shogun)
   Obstacle & Cash MVP                OCR & Voice Commands                 25-User Blind Cohort Test
   - YOLOv8-nano detection            - Scene text reading                 - Real-world campus/metro trials
   - MobileNetV3 currency             - Hands-free voice trigger           - Edge INT8 quantization (offline)
   - 4-quadrant accessible UI         - Audio priority interrupts          - Usability & latency profiling
```

---

## Phase Breakdown

### Phase 1: Kenshi (MVP Foundation) — Weeks 1 to 3
**Goal:** Get a working build on a physical phone that solves the two most urgent needs: obstacle alerts and cash identification.

- **Tasks:**
  - Export and fine-tune YOLOv8-nano for 10 common indoor/outdoor obstacles.
  - Train MobileNetV3 on Indian Rupee currency dataset (₹10 to ₹500).
  - Build initial Flutter app with 4 tactile screen quadrants and TalkBack labels.
  - Basic spatial voice alert logic: *"Chair 2 steps ahead to your left"*.
- **Milestone Check:** Working mobile demo running obstacle detection and cash recognition on a real smartphone.

---

### Phase 2: Samurai (Feature Polish & Backend) — Weeks 4 to 6
**Goal:** Add text reading, voice controls, and production backend with telemetry.

- **Tasks:**
  - Integrate fast OCR engine for signs, room numbers, and medicine labels.
  - Add voice trigger / speech-to-text so users can switch modes hands-free.
  - Build audio priority engine: an immediate hazard alert instantly silences ongoing text reading.
  - Deploy FastAPI backend on Render / Fly.io with Supabase passwordless auth.
  - Settings screen to let users adjust speech speed and haptic feedback strength.
- **Milestone Check:** End-to-end cloud API connected, speech speed controls working, OCR functional.

---

### Phase 3: Shogun (25-User Real-World Test & Edge Quantization) — Weeks 7 to 8
**Goal:** Put the app in the hands of 25 visually impaired users and optimize for 100% offline edge execution.

- **Tasks:**
  - Onboard 25 visually impaired students and commuters for a 14-day field test.
  - Quantize models to INT8 (TFLite / ONNX) so obstacle and cash detection work with zero internet.
  - Profile latency to keep camera-to-audio delay under 350ms.
  - Add Hindi voice output alongside English.
  - Collect usability metrics, false-positive reports, and feedback.
- **Milestone Check:** Complete test report from the 25-user cohort, sub-350ms verified latency, and offline support.

---

## Weekly Schedule

| Week | Focus Area | Deliverable |
| :--- | :--- | :--- |
| **Week 1** | Specs & Wireframes | PRD, Architecture, and Excalidraw UI flow locked |
| **Week 2** | Model Prep | Currency dataset trained, YOLOv8n exported |
| **Week 3** | Kenshi MVP | Flutter app running live camera demo + voice alerts |
| **Week 4** | OCR Integration | Signage reading and voice command parser |
| **Week 5** | Backend & Audio Queue | FastAPI deployed + priority audio interrupt engine |
| **Week 6** | Samurai Review | Full multi-modal feature set operational |
| **Week 7** | 25-User Cohort Trial | Field testing with visually impaired testers |
| **Week 8** | Shogun Final Release | Offline INT8 model, latency tuning, project wrap-up |
