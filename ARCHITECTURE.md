# System Architecture (ARCHITECTURE.md)

## Project: BlindFold (VisionMate)
**Overview:** Low-latency mobile-to-cloud vision pipeline built for real-time obstacle alerts and cash identification.

---

## 1. System Overview

```
+-------------------------------------------------------------------------+
|                         FLUTTER MOBILE CLIENT                           |
|                                                                         |
|  [ Camera Feed (15 FPS) ]         [ Audio & Haptics Engine ]            |
|            │                                  ▲                         |
|            ▼                                  │                         |
|  [ Frame Resizer (640x640) ]                  │ (Spoken Audio / Buzz)   |
|            │                                  │                         |
|            ▼                                  │                         |
|  [ Local Fast-Path (TFLite) ]                 │                         |
|     └─ Offloads to Cloud API when online ─────┼─────────────────────────┘
+────────────────────┬──────────────────────────┼─────────────────────────+
                     │ HTTPS / WSS              │
                     ▼                          │
+───────────────────────────────────────────────┴─────────────────────────+
|                           FASTAPI BACKEND                               |
|                                                                         |
|  [ API Router + Supabase JWT Auth ]                                     |
|            │                                                            |
|            ├──────────────────────────┬─────────────────────────────┐   |
|            ▼                          ▼                             ▼   |
|  [ YOLOv8n Obstacle Worker ]  [ MobileNetV3 Cash Worker ]  [ Scene OCR ]|
|  (Outputs boxes + classes)    (Outputs denomination)       (Phase 2)    |
|            │                          │                             │   |
|            └──────────────────────────┴─────────────────────────────┘   |
|                                       │                                 |
|                                       ▼                                 |
|                         [ Distance & Spatial Logic ]                    |
|                         - Bounding box height -> distance estimate      |
|                         - Horizontal center -> Left / Center / Right    |
|                         - Immediate hazard -> Priority alert sound      |
|                                       │                                 |
|                                       ▼                                 |
|                         [ Spoken Text Generator ]                       |
|                         Returns JSON with plain English voice prompt    |
+───────────────────────────────────────┬─────────────────────────────────+
                                        │
                                        ▼ (Async telemetry)
+─────────────────────────────────────────────────────────────────────────+
|                        SUPABASE / POSTGRESQL                            |
|                                                                         |
|  - Users & Accessibility Profiles (voice speed, haptic preferences)     |
|  - Detection sessions & latency logs                                    |
|  - NOTE: Zero image storage — frames are dropped right after inference. |
+─────────────────────────────────────────────────────────────────────────+
```

---

## 2. Tech Stack & Why We Chose It

- **Mobile Client: Flutter (Dart)**  
  One codebase for Android and iOS. Flutter has solid TalkBack/VoiceOver support out of the box, easy camera stream controllers, and renders at 60 FPS smoothly.

- **Backend: FastAPI (Python 3.11)**  
  Fast async request handling, auto-generates OpenAPI docs, and works directly with PyTorch / ONNX models without extra wrapper overhead.

- **Vision Models: ONNX Runtime (YOLOv8-nano + MobileNetV3)**  
  YOLOv8-nano gives us ~30-40ms CPU inference time. Running via ONNX Runtime means we don't need heavy GPU servers for MVP and can eventually port the same model directly on-device using TFLite.

- **Auth & Database: Supabase (PostgreSQL)**  
  Built-in passwordless magic links and biometric tokens mean visually impaired users never have to struggle typing passwords. Postgres gives us reliable storage for user settings and latency logs.

- **Hosting: Render or Fly.io (Docker)**  
  Simple container deployments, close edge locations, and fast spin-up times for API updates.

---

## 3. Data Flow: From Camera to Earphone

Here's what happens during an obstacle scan:

1. **Capture:** Flutter camera stream grabs a frame, compresses it to 640x640 JPEG.
2. **Send:** Dispatches via `POST /api/v1/vision/detect-obstacles` with user JWT token.
3. **Inference:** FastAPI reads image bytes into memory (never saves to disk) and runs YOLOv8-nano ONNX.
4. **Spatial Mapping:**
   - **Zone:** Horizontal center `(x1 + x2) / 2` maps to Left (<33%), Center (33-66%), or Right (>66%).
   - **Distance:** If box height covers >50% of the frame, the obstacle is less than 1.5 meters away (Immediate Hazard).
5. **Priority Check:**
   - If hazard is immediate: Return high-priority alert code (`DOUBLE_PULSE_HEAVY` haptic + *"Warning: Chair right ahead"*).
   - If clear: Return simple prompt (*"Clear ahead"* or *"Table on your right"*).
6. **Playback:** Flutter receives the JSON response and triggers native TTS audio in under 350ms total.

---

## 4. Database Schema (PostgreSQL)

We keep the schema simple and focused on user preferences and latency monitoring:

```sql
-- Core users (handled via Supabase Auth)
-- auth.users

-- User accessibility settings
CREATE TABLE accessibility_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    speech_rate FLOAT DEFAULT 1.2,          -- blind users usually prefer 1.2x - 1.5x
    speech_volume FLOAT DEFAULT 1.0,
    preferred_voice VARCHAR(50) DEFAULT 'en-IN-Standard',
    haptics_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session tracking (to see average session time and model latency)
CREATE TABLE detection_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type VARCHAR(20) NOT NULL,      -- 'OBSTACLE', 'CURRENCY', 'OCR'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_frames INT DEFAULT 0
);

-- Performance & feedback telemetry (NO IMAGES STORED)
CREATE TABLE detection_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES detection_sessions(id) ON DELETE CASCADE,
    detected_class VARCHAR(50),
    confidence FLOAT,
    latency_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User bug / misclassification feedback (e.g. user double-taps: "that wasn't a 500 note")
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_id UUID REFERENCES detection_logs(id),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 5. Security & Privacy Rules

- **Zero Camera Footage Retention:** We never save photos or video clips to disk or database. Frames live in memory buffer during model inference and are discarded immediately.
- **Biometric / Magic Link Auth:** No typing passwords. Users sign in via phone biometrics (fingerprint/FaceID) or 1-tap OTP.
- **TLS 1.3:** All API communication is strictly encrypted over HTTPS.
