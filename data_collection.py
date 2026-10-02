import cv2
import os
import re
import time

# ==========================================
# CONFIGURATION
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path directly to currency training dataset
DATASET_DIR = os.path.join(BASE_DIR, "Currency", "Indian currency dataset v1", "training")

# Quick hotkey map for each denomination
CLASS_MAP = {
    '1': "10",
    '2': "20",
    '3': "50",
    '4': "100",
    '5': "200",
    '6': "500",
    '7': "2000",
    '0': "Background"
}

def ensure_folders():
    """Create class subdirectories if they do not exist."""
    for class_name in CLASS_MAP.values():
        folder_path = os.path.join(DATASET_DIR, class_name)
        os.makedirs(folder_path, exist_ok=True)

def get_next_index(class_name):
    """
    Scans the folder to find the highest number in '<class>__<number>.jpg'
    and returns (highest_number + 1) so new images seamlessly continue the sequence.
    """
    folder_path = os.path.join(DATASET_DIR, class_name)
    if not os.path.exists(folder_path):
        return 0
    
    indices = []
    pattern = re.compile(rf"{re.escape(class_name)}__(\d+)\.(jpg|jpeg|png|webp)$", re.IGNORECASE)
    
    for filename in os.listdir(folder_path):
        match = pattern.match(filename)
        if match:
            indices.append(int(match.group(1)))
        else:
            nums = re.findall(r'\d+', filename)
            if nums:
                indices.append(int(nums[-1]))
                
    if not indices:
        return 0
    return max(indices) + 1

def count_existing_images(class_name):
    """Total image files in the folder."""
    folder_path = os.path.join(DATASET_DIR, class_name)
    if not os.path.exists(folder_path):
        return 0
    valid_exts = ('.jpg', '.jpeg', '.png', '.webp')
    return len([f for f in os.listdir(folder_path) if f.lower().endswith(valid_exts)])

def main():
    ensure_folders()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Error: Could not access the webcam.")
        return

    # 720p resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    current_key = '6'  # Default to Rs 500
    current_class = CLASS_MAP[current_key]
    next_index = get_next_index(current_class)

    auto_capture = False
    auto_capture_interval = 0.35  # seconds
    last_capture_time = 0

    session_count = 0
    flash_frames = 0

    print("\n" + "=" * 60)
    print(" 📸 BLINDFOLD DATA COLLECTOR (CROPPED BOX CAPTURE)")
    print("=" * 60)
    print(" NOTE: Only the area INSIDE the box is saved, matching")
    print(" the tight banknote crops of the original dataset!")
    print("=" * 60)
    print(" Key Controls:")
    print("   [1] Rs 10    [2] Rs 20     [3] Rs 50")
    print("   [4] Rs 100   [5] Rs 200    [6] Rs 500")
    print("   [7] Rs 2000  [0] Background")
    print("   ----------------------------------------")
    print("   [SPACE] or [C] : Snap single picture")
    print("   [A]            : Toggle Auto-Burst capture")
    print("   [Q] or [ESC]   : Quit program")
    print("=" * 60 + "\n")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab video frame.")
            break

        h, w, _ = frame.shape
        display = frame.copy()

        # ----------------------------------------------------
        # Calculate Crop Box Coordinates (Center 65% width, 55% height)
        # ----------------------------------------------------
        box_w, box_h = int(w * 0.65), int(h * 0.55)
        x1 = max(0, (w - box_w) // 2)
        y1 = max(0, (h - box_h) // 2)
        x2 = min(w, x1 + box_w)
        y2 = min(h, y1 + box_h)

        # The actual cropped region
        cropped_roi = frame[y1:y2, x1:x2].copy()

        now = time.time()
        snap_this_frame = False

        if auto_capture and (now - last_capture_time >= auto_capture_interval):
            snap_this_frame = True
            last_capture_time = now

        # ----------------------------------------------------
        # Save Cropped Image when Triggered
        # ----------------------------------------------------
        if snap_this_frame:
            save_folder = os.path.join(DATASET_DIR, current_class)
            filename = f"{current_class}__{next_index}.jpg"
            save_path = os.path.join(save_folder, filename)

            # SAVE CROPPED NOTE (NOT whole screen!)
            cv2.imwrite(save_path, cropped_roi)
            print(f"✅ Saved Cropped Box: {filename} (Size: {cropped_roi.shape[1]}x{cropped_roi.shape[0]})")

            next_index += 1
            session_count += 1
            flash_frames = 3

        # ----------------------------------------------------
        # UI HUD Overlay
        # ----------------------------------------------------
        box_color = (0, 255, 0) if auto_capture else (44, 147, 254)
        cv2.rectangle(display, (x1, y1), (x2, y2), box_color, 3)
        cv2.putText(display, "FRAME NOTE INSIDE THIS BOX (ONLY THIS IS SAVED)", 
                    (x1 + 10, y1 + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.55, box_color, 2)

        # Status Card (Top-Left)
        cv2.rectangle(display, (15, 15), (510, 130), (15, 23, 42), -1)
        cv2.rectangle(display, (15, 15), (510, 130), (255, 255, 255), 2)

        class_text = f"CLASS: Rs {current_class}" if current_class != "Background" else "CLASS: Background"
        cv2.putText(display, class_text, (25, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.85, (44, 147, 254), 2)
        
        next_file_text = f"Next save: {current_class}__{next_index}.jpg"
        cv2.putText(display, next_file_text, (25, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (100, 255, 100), 2)

        stat_text = f"Total in folder: {count_existing_images(current_class)} | Added now: {session_count}"
        cv2.putText(display, stat_text, (25, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (220, 220, 220), 1)

        mode_text = "MODE: [AUTO-BURST ON]" if auto_capture else "MODE: [MANUAL - PRESS SPACE]"
        mode_color = (50, 255, 50) if auto_capture else (200, 200, 200)
        cv2.putText(display, mode_text, (25, 122), cv2.FONT_HERSHEY_SIMPLEX, 0.5, mode_color, 1)

        # Live Thumbnail Preview (Top-Right) showing exactly what gets saved
        preview_thumb = cv2.resize(cropped_roi, (180, 110))
        th, tw, _ = preview_thumb.shape
        display[15:15+th, w-195:w-195+tw] = preview_thumb
        cv2.rectangle(display, (w-195, 15), (w-15, 15+th), box_color, 2)
        cv2.putText(display, "SAVED PREVIEW", (w-190, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 2)
        cv2.putText(display, "SAVED PREVIEW", (w-190, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)

        # Bottom Bar
        cv2.rectangle(display, (15, h - 45), (w - 15, h - 15), (15, 23, 42), -1)
        cv2.putText(display, "[1-7, 0] Switch Class | [SPACE] Snap | [A] Auto-Burst | [Q] Quit", 
                    (25, h - 25), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)

        # Flash visual feedback
        if flash_frames > 0:
            cv2.rectangle(display, (x1, y1), (x2, y2), (255, 255, 255), 8)
            flash_frames -= 1

        cv2.imshow("BlindFold - Data Collector", display)

        # Key Handling
        key = cv2.waitKey(1) & 0xFF

        if key in [ord('q'), 27]:
            break
        elif key in [ord('c'), 32]:  # SPACE or C
            save_folder = os.path.join(DATASET_DIR, current_class)
            filename = f"{current_class}__{next_index}.jpg"
            save_path = os.path.join(save_folder, filename)

            # SAVE CROPPED NOTE
            cv2.imwrite(save_path, cropped_roi)
            print(f"📸 Snapped Cropped Box: {filename} (Class: Rs {current_class})")

            next_index += 1
            session_count += 1
            flash_frames = 4
        elif key == ord('a'):
            auto_capture = not auto_capture
            mode_str = "ENABLED" if auto_capture else "PAUSED"
            print(f"🔄 Auto-capture {mode_str}")
        elif chr(key) in CLASS_MAP:
            current_key = chr(key)
            current_class = CLASS_MAP[current_key]
            next_index = get_next_index(current_class)
            print(f"➡️ Switched to: Rs {current_class} (Continuing at {current_class}__{next_index}.jpg)")

    cap.release()
    cv2.destroyAllWindows()
    print(f"\nFinished. Added {session_count} new cropped images to dataset.")

if __name__ == "__main__":
    main()
