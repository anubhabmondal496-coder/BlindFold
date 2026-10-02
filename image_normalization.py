import numpy as np
import os
import cv2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_ROOT = os.path.join(BASE_DIR, "Currency", "Indian currency dataset v1")

classes = ["10", "20", "50", "100", "200", "500"]

def image_processing(split="training"):
    split_path = os.path.join(DATA_ROOT, split)
    if not os.path.exists(split_path):
        raise FileNotFoundError(f"Directory not found: '{split_path}'. Please check that 'Indian currency dataset v1' is present inside 'Currency'.")

    images = []
    labels = []
    
    for label, class_name in enumerate(classes):
        class_path = os.path.join(split_path, class_name)
        if not os.path.exists(class_path):
            print(f"Warning: Class folder '{class_name}' not found at {class_path}")
            continue

        for file_name in os.listdir(class_path):
            image_path = os.path.join(class_path, file_name)

            img = cv2.imread(image_path)
            if img is None:
                continue

            img = cv2.resize(img, (128, 128))
            img = img / 255.0

            images.append(img)
            labels.append(label)

    X = np.array(images, dtype=np.float32)
    y = np.array(labels, dtype=np.int32)

    print(f"Loaded {len(X)} images from '{split}' split across {len(classes)} classes.")
    return X, y
