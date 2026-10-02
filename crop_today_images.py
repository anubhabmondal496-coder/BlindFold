import os
import glob
import cv2
from datetime import datetime

ROOT_DIR = r"c:\Users\ANUBHAB\Desktop\jorney-2-mastery\Currency\Indian currency dataset v1\training"
CLASSES_TO_CROP = ["10", "20", "50", "100", "200", "500"]

# Box dimensions matching data_collection.py
# w=1280, h=720
# box_w = int(1280 * 0.65) = 832
# box_h = int(720 * 0.55) = 396
# x1 = (1280 - 832) // 2 = 224
# y1 = (720 - 396) // 2 = 162
# x2 = 224 + 832 = 1056
# y2 = 162 + 396 = 558

X1, Y1 = 224, 162
X2, Y2 = 1056, 558

today = datetime.now().date()
cropped_count = 0
skipped_count = 0

print(f"Scanning for full-screen images captured today ({today})...")

for class_name in CLASSES_TO_CROP:
    class_folder = os.path.join(ROOT_DIR, class_name)
    if not os.path.exists(class_folder):
        continue

    for img_path in glob.glob(os.path.join(class_folder, "*.jpg")):
        mtime = datetime.fromtimestamp(os.path.getmtime(img_path))
        
        # Only process images captured today
        if mtime.date() == today:
            img = cv2.imread(img_path)
            if img is None:
                continue

            h, w = img.shape[:2]
            
            # Check if this is an uncropped full-frame 720p image (720x1280)
            if h == 720 and w == 1280:
                cropped = img[Y1:Y2, X1:X2]
                cv2.imwrite(img_path, cropped)
                cropped_count += 1
            else:
                skipped_count += 1

print(f"\nDone! Successfully cropped {cropped_count} images to the rectangle box ({X2-X1}x{Y2-Y1}).")
print(f"Skipped {skipped_count} images that were already cropped or from previous days.")
