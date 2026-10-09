"""
BlindFold - Real-Time Obstacle & Person Distance Estimation
Monocular Pinhole Geometric Distance Calculation with Audio Assistance (TTS)
Supports: ['bench', 'bike', 'car', 'chair', 'dog', 'person', 'pothole', 'stairs', 'tree', 'zebra_crossing']
"""

import cv2
import numpy as np
import time
import threading
import queue
import pyttsx3
from pathlib import Path
from ultralytics import YOLO

# ==========================================
# 1. Physical Reference Dimensions (Meters)
# ==========================================
# For monocular distance calculation D = (F * Real_Dimension) / Pixel_Dimension
# Upright objects measure by height; ground objects measure by width.
OBSTACLE_PROFILES = {
    "person":         {"axis": "h", "dim": 1.70, "label": "Person"},
    "car":            {"axis": "h", "dim": 1.50, "label": "Car"},
    "bike":           {"axis": "h", "dim": 1.10, "label": "Bicycle"},
    "chair":          {"axis": "h", "dim": 0.85, "label": "Chair"},
    "bench":          {"axis": "h", "dim": 0.75, "label": "Bench"},
    "dog":            {"axis": "h", "dim": 0.55, "label": "Dog"},
    "tree":           {"axis": "h", "dim": 2.20, "label": "Tree"},
    "stairs":         {"axis": "h", "dim": 1.20, "label": "Stairs"},
    "pothole":        {"axis": "w", "dim": 0.50, "label": "Pothole"},
    "zebra_crossing": {"axis": "w", "dim": 2.50, "label": "Zebra crossing"},
}

DEFAULT_STEP_SIZE = 0.75  

# ==========================================
# 2. Threaded Text-to-Speech Engine
# ==========================================
class AudioAlertSystem:
    def __init__(self, speech_interval=2.2):
        self.speech_interval = speech_interval
        self.speech_queue = queue.Queue(maxsize=3)
        self.last_spoken_time = 0.0
        self.last_spoken_phrase = ""
        self.enabled = True
        self.is_running = True
        
        self.worker = threading.Thread(target=self._tts_loop, daemon=True)
        self.worker.start()

    def _tts_loop(self):
        # Initialize pyttsx3 inside the worker thread for COM compatibility
        try:
            engine = pyttsx3.init()
            engine.setProperty('rate', 170)    # Clear, intelligible pace
            engine.setProperty('volume', 1.0)
        except Exception as e:
            print(f"[TTS Error] Could not initialize pyttsx3: {e}")
            return

        while self.is_running:
            try:
                phrase = self.speech_queue.get(timeout=0.2)
                if phrase and self.enabled:
                    engine.say(phrase)
                    engine.runAndWait()
                self.speech_queue.task_done()
            except queue.Empty:
                continue
            except Exception as e:
                print(f"[TTS Worker Error]: {e}")

    def speak(self, phrase, force_urgent=False):
        now = time.time()
        if not self.enabled:
            return
        
        # Don't repeat the exact same phrase within short interval unless urgent
        if phrase == self.last_spoken_phrase and (now - self.last_spoken_time < 3.0) and not force_urgent:
            return

        if force_urgent or (now - self.last_spoken_time >= self.speech_interval):
            self.last_spoken_time = now
            self.last_spoken_phrase = phrase
            # Clear stale messages if urgent
            if force_urgent:
                while not self.speech_queue.empty():
                    try:
                        self.speech_queue.get_nowait()
                    except queue.Empty:
                        break
            try:
                self.speech_queue.put_nowait(phrase)
            except queue.Full:
                pass

    def stop(self):
        self.is_running = False


# ==========================================
# 3. Distance & Direction Calculator
# ==========================================
class DistanceEstimator:
    def __init__(self, frame_w, frame_h):
        self.frame_w = frame_w
        self.frame_h = frame_h
        # Pinhole Camera Focal Length approx: F ~ frame_dim / (2 * tan(FOV/2))
        # Standard webcam vertical FOV ~55°-65° -> F_y ~ 0.95 * frame_h
        self.fy = 0.95 * frame_h
        self.fx = 0.95 * frame_w

    def estimate_distance(self, class_name, bbox_w, bbox_h):
        profile = OBSTACLE_PROFILES.get(class_name, {"axis": "h", "dim": 1.0})
        
        if profile["axis"] == "h":
            pixel_size = max(bbox_h, 8)
            distance = (self.fy * profile["dim"]) / pixel_size
        else:
            pixel_size = max(bbox_w, 8)
            distance = (self.fx * profile["dim"]) / pixel_size

        # Clamp to realistic human range (0.3m to 25m)
        distance = max(0.3, min(25.0, distance))
        steps = max(1, round(distance / DEFAULT_STEP_SIZE))
        return round(distance, 1), steps

    def get_zone(self, center_x):
        ratio = center_x / self.frame_w
        if ratio < 0.35:
            return "Left", "on your left"
        elif ratio > 0.65:
            return "Right", "on your right"
        else:
            return "Center", "straight ahead"


# ==========================================
# 4. Main Realtime Detection Loop
# ==========================================
def run_detector(model_path="Models/best.pt", camera_index=0, confidence_threshold=0.35):
    # Locate model
    resolved_path = Path(model_path)
    if not resolved_path.exists():
        # Fallback checks
        candidates = [
            Path("best.pt"),
            Path("runs/detect/blindfold_nav_combined/weights/best.pt"),
            Path(__file__).parent / "Models" / "best.pt",
        ]
        for c in candidates:
            if c.exists():
                resolved_path = c
                break

    if not resolved_path.exists():
        raise FileNotFoundError(f"Model file '{model_path}' not found!")

    print(f"[BlindFold] Loading YOLO model from '{resolved_path}'...")
    model = YOLO(str(resolved_path))
    print("[BlindFold] Model loaded successfully.")

    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        print(f"[Error] Could not access webcam at index {camera_index}.")
        return

    # Set 720p or default resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    ret, sample_frame = cap.read()
    if not ret:
        print("[Error] Failed to read from webcam.")
        cap.release()
        return

    h, w = sample_frame.shape[:2]
    estimator = DistanceEstimator(frame_w=w, frame_h=h)
    audio = AudioAlertSystem(speech_interval=2.5)

    print("\n" + "="*50)
    print(" BlindFold Real-Time Distance & Obstacle Radar ")
    print(" Supports all 10 trained obstacle & hazard classes ")
    print(" Controls: [M] Mute/Unmute Audio | [Q] Exit ")
    print("="*50 + "\n")

    audio.speak("BlindFold obstacle distance radar activated.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Inference
        results = model.predict(frame, conf=confidence_threshold, verbose=False)
        detections = []

        if results and len(results[0].boxes) > 0:
            for box in results[0].boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                cls_name = model.names[cls_id]

                # Bounding box coords
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                bw = x2 - x1
                bh = y2 - y1
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2

                distance_m, steps = estimator.estimate_distance(cls_name, bw, bh)
                zone_name, zone_speech = estimator.get_zone(cx)

                detections.append({
                    "class": cls_name,
                    "label": OBSTACLE_PROFILES.get(cls_name, {}).get("label", cls_name.title()),
                    "conf": conf,
                    "distance": distance_m,
                    "steps": steps,
                    "zone": zone_name,
                    "zone_speech": zone_speech,
                    "coords": (x1, y1, x2, y2),
                    "center": (cx, cy)
                })

        # Sort detections: Prioritize closer items in the center path
        def priority_score(d):
            # Center obstacles have lower score (higher urgency)
            zone_penalty = 0.0 if d["zone"] == "Center" else 0.8
            return d["distance"] + zone_penalty

        detections.sort(key=priority_score)

        # ----------------------------------------
        # Audio Guidance Logic
        # ----------------------------------------
        if detections:
            primary = detections[0]
            dist = primary["distance"]
            label = primary["label"]
            zone = primary["zone_speech"]
            steps = primary["steps"]

            if dist < 1.1 and primary["zone"] == "Center":
                # Critical proximity right in path
                audio.speak(f"Warning! {label} right ahead, stop!", force_urgent=True)
            elif dist <= 2.2:
                # Caution range
                step_str = f"{steps} step" if steps == 1 else f"{steps} steps"
                audio.speak(f"{label}, {step_str} {zone}.")
            elif dist <= 4.0 and primary["zone"] == "Center":
                # Noticeable path obstacle
                audio.speak(f"{label}, {dist} meters ahead.")

        # ----------------------------------------
        # High-Contrast Tactile Overlay (HUD)
        # ----------------------------------------
        overlay = frame.copy()

        # Visual Corridor Guides (Left / Center / Right)
        x_left_guide = int(w * 0.35)
        x_right_guide = int(w * 0.65)
        cv2.line(overlay, (x_left_guide, 0), (x_left_guide, h), (70, 70, 70), 1)
        cv2.line(overlay, (x_right_guide, 0), (x_right_guide, h), (70, 70, 70), 1)

        for d in detections:
            x1, y1, x2, y2 = d["coords"]
            dist = d["distance"]
            label = d["label"]
            zone = d["zone"]
            steps = d["steps"]

            # Color coding: Red (<1.2m), Amber (1.2m - 2.5m), Emerald/Blue (>2.5m)
            if dist < 1.2:
                box_color = (30, 30, 220)       # Critical Red
                tag_bg = (30, 30, 220)
                text_color = (255, 255, 255)
            elif dist <= 2.5:
                box_color = (21, 204, 250)      # Caution Amber / Yellow
                tag_bg = (21, 204, 250)
                text_color = (15, 23, 42)
            else:
                box_color = (254, 147, 44)      # Calm Blue
                tag_bg = (254, 147, 44)
                text_color = (255, 255, 255)

            # Draw obstacle bounding box
            cv2.rectangle(overlay, (x1, y1), (x2, y2), box_color, 2)

            # Header Badge: "[LABEL] • [DIST]m ([STEPS] steps) • [ZONE]"
            tag_text = f"{label.upper()} | {dist}m ({steps} steps) | {zone.upper()}"
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.55
            thickness = 2
            (tw, th), _ = cv2.getTextSize(tag_text, font, font_scale, thickness)

            # Tag background
            badge_y1 = max(0, y1 - th - 12)
            badge_y2 = y1
            cv2.rectangle(overlay, (x1, badge_y1), (x1 + tw + 16, badge_y2), tag_bg, -1)
            cv2.putText(overlay, tag_text, (x1 + 8, y1 - 6), font, font_scale, text_color, thickness, cv2.LINE_AA)

            # Dot at center
            cv2.circle(overlay, d["center"], 4, box_color, -1)

        # Top Status Bar (Tactile Clarity Slate HUD)
        cv2.rectangle(overlay, (0, 0), (w, 60), (15, 23, 42), -1)
        
        title_text = "BLINDFOLD OBSTACLE RADAR"
        cv2.putText(overlay, title_text, (20, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2, cv2.LINE_AA)

        # Audio status indicator
        audio_status = "AUDIO: ON [M to mute]" if audio.enabled else "AUDIO: MUTED [M to unmute]"
        audio_color = (44, 215, 120) if audio.enabled else (120, 120, 120)
        cv2.putText(overlay, audio_status, (w - 290, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.55, audio_color, 1, cv2.LINE_AA)

        # Primary hazard notice in HUD
        if detections:
            top_h = detections[0]
            summary = f"NEAREST: {top_h['label']} @ {top_h['distance']}m ({top_h['steps']} steps) [{top_h['zone'].upper()}]"
            bar_color = (30, 30, 220) if top_h['distance'] < 1.2 else (21, 204, 250)
            cv2.putText(overlay, summary, (420, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.65, bar_color, 2, cv2.LINE_AA)
        else:
            cv2.putText(overlay, "PATH CLEAR", (420, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (44, 215, 120), 2, cv2.LINE_AA)

        cv2.imshow("BlindFold - Real-Time Obstacle Distance Estimation", overlay)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('m'):
            audio.enabled = not audio.enabled
            state_str = "unmuted" if audio.enabled else "muted"
            print(f"[BlindFold] Audio {state_str}.")

    # Clean up
    audio.stop()
    cap.release()
    cv2.destroyAllWindows()
    print("[BlindFold] Radar stream stopped.")


if __name__ == "__main__":
    run_detector()
