# API Specification (API_SPEC.md)

## Base URL
- **Local Dev:** `http://localhost:8000/api/v1`
- **Staging / Prod:** `https://api.blindfold-ai.org/api/v1`

All requests except health checks require a Bearer token in the header:
```http
Authorization: Bearer <access_token>
```

---

## 1. Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server uptime & model status |
| `POST` | `/auth/login` | Passwordless / OTP authentication |
| `POST` | `/auth/refresh` | Exchange refresh token for new access token |
| `GET` | `/users/profile` | Fetch user's speech rate, voice, and haptic preferences |
| `PUT` | `/users/profile` | Update user accessibility settings |
| `POST` | `/sessions/start` | Start a detection session (returns `session_id`) |
| `POST` | `/sessions/{id}/end` | End a detection session |
| `POST` | `/vision/detect-obstacles` | Upload frame -> returns hazard bounding boxes, zone, and spoken text |
| `POST` | `/vision/classify-currency` | Upload note picture -> returns denomination and confidence |
| `POST` | `/vision/read-text` | (Phase 2) OCR on signage/doors |
| `POST` | `/feedback/log` | User reports misclassification (e.g. wrong currency value) |

---

## 2. Standard Response Format

Success responses return JSON wrapped in `data`:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses always include `audio_friendly_message`. That way the mobile app doesn't have to guess how to phrase an error to the user — it can pass it straight to the TTS voice engine:

```json
{
  "success": false,
  "error": {
    "code": "IMAGE_TOO_BLURRY",
    "message": "Laplacian variance score was 24.8, minimum required is 60.0",
    "audio_friendly_message": "Photo is blurry. Please hold your phone still and try again.",
    "status_code": 422
  }
}
```

Common spoken error prompts:
- `401 Unauthorized` -> *"Session expired. Tap to sign in again."*
- `422 Unprocessable` -> *"Image too blurry. Hold the note steady."*
- `429 Rate Limit` -> *"Pausing briefly to catch up. Resuming in a second."*
- `500 Server Error` -> *"Vision service temporarily down. Trying again."*

---

## 3. Key Endpoint Payloads

### `POST /vision/detect-obstacles`
Uploads a 640x640 camera frame.

**Request:** `multipart/form-data`
- `file`: binary JPEG frame
- `session_id`: UUID

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "detection_count": 1,
    "primary_hazard": {
      "label": "chair",
      "zone": "CENTER",
      "distance": "IMMEDIATE",
      "confidence": 0.94,
      "bounding_box": { "x1": 180, "y1": 220, "x2": 460, "y2": 580 }
    },
    "spoken_alert": "Caution: Chair right ahead, less than two steps away.",
    "haptic_pattern": "DOUBLE_PULSE_HEAVY",
    "latency_ms": 38
  }
}
```

---

### `POST /vision/classify-currency`
Uploads a photo of a banknote.

**Request:** `multipart/form-data`
- `file`: binary JPEG photo of note

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "currency": "INR",
    "denomination": 500,
    "confidence": 0.98,
    "spoken_alert": "Five hundred rupees.",
    "haptic_pattern": "LONG_VIBRATION",
    "latency_ms": 28
  }
}
```

---

### `PUT /users/profile`
Updates accessibility settings.

**Request Body (`application/json`):**
```json
{
  "speech_rate": 1.4,
  "speech_volume": 1.0,
  "preferred_voice": "en-IN-Standard",
  "haptics_enabled": true
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "updated": true,
    "speech_rate": 1.4
  }
}
```
