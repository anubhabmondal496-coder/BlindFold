import os
import shutil
import glob
from pathlib import Path

# Paths
BASE_DIR = Path(r"c:\Users\ANUBHAB\Desktop\jorney-2-mastery")
OUTPUT_DIR = BASE_DIR / "combined_dataset"

STAIR_DIR = BASE_DIR / "stair_dataset"
ZEBRA_DIR = BASE_DIR / "zebra crossing.v1i.yolo26"
POTHOLE_DIR = BASE_DIR / "pothole.v17i.yolo26"

MASTER_CLASSES = [
    'bench',           # 0
    'bike',            # 1
    'car',             # 2
    'chair',           # 3
    'dog',             # 4
    'person',          # 5
    'pothole',         # 6
    'stairs',          # 7
    'tree',            # 8
    'zebra_crossing'   # 9
]

SPLITS = ['train', 'valid', 'test']

def setup_dirs():
    for split in SPLITS:
        (OUTPUT_DIR / split / "images").mkdir(parents=True, exist_ok=True)
        (OUTPUT_DIR / split / "labels").mkdir(parents=True, exist_ok=True)

def copy_and_remap(source_dir, prefix, class_map, is_val=False):
    """
    class_map: dict of {source_class_id: target_class_id}
    """
    total_copied = 0
    for split in SPLITS:
        src_split_dir = source_dir / split
        if not src_split_dir.exists():
            print(f"Split {split} not found in {source_dir}, skipping.")
            continue
            
        src_images_dir = src_split_dir / "images"
        src_labels_dir = src_split_dir / "labels"
        
        tgt_images_dir = OUTPUT_DIR / split / "images"
        tgt_labels_dir = OUTPUT_DIR / split / "labels"
        
        image_files = list(src_images_dir.glob("*.*"))
        for img_path in image_files:
            if img_path.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.webp', '.bmp']:
                continue
                
            new_stem = f"{prefix}_{img_path.stem}"
            new_img_name = f"{new_stem}{img_path.suffix}"
            tgt_img_path = tgt_images_dir / new_img_name
            
            # Copy image
            shutil.copy2(img_path, tgt_img_path)
            
            # Look for matching label
            src_label_path = src_labels_dir / f"{img_path.stem}.txt"
            tgt_label_path = tgt_labels_dir / f"{new_stem}.txt"
            
            if src_label_path.exists():
                new_lines = []
                with open(src_label_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        parts = line.strip().split()
                        if not parts:
                            continue
                        old_cls = int(parts[0])
                        if old_cls in class_map:
                            new_cls = class_map[old_cls]
                            new_lines.append(f"{new_cls} " + " ".join(parts[1:]))
                
                with open(tgt_label_path, 'w', encoding='utf-8') as f:
                    f.write("\n".join(new_lines) + ("\n" if new_lines else ""))
            else:
                # If no label file, create empty label file for background / negative sample
                open(tgt_label_path, 'w').close()
                
            total_copied += 1
            
    print(f"Copied and remapped {total_copied} images from {source_dir.name} (prefix: {prefix})")

def create_data_yaml():
    yaml_content = f"""# Master BlindFold Combined Dataset
path: {OUTPUT_DIR.as_posix()}
train: train/images
val: valid/images
test: test/images

nc: {len(MASTER_CLASSES)}
names: {MASTER_CLASSES}
"""
    yaml_file = OUTPUT_DIR / "data.yaml"
    with open(yaml_file, 'w', encoding='utf-8') as f:
        f.write(yaml_content)
    print(f"Generated master data.yaml at {yaml_file}")

def verify_dataset():
    print("\n--- Combined Dataset Verification ---")
    for split in SPLITS:
        imgs = len(list((OUTPUT_DIR / split / "images").glob("*.*")))
        lbls = len(list((OUTPUT_DIR / split / "labels").glob("*.txt")))
        print(f"Split [{split}]: {imgs} images, {lbls} label files")

def main():
    print("Starting dataset merge...")
    setup_dirs()
    
    # 1. Merge stair_dataset (IDs 0..8 map 1:1)
    stair_map = {i: i for i in range(9)}
    copy_and_remap(STAIR_DIR, "stair", stair_map)
    
    # 2. Merge zebra crossing (ID 0 -> 9: zebra_crossing)
    zebra_map = {0: 9}
    copy_and_remap(ZEBRA_DIR, "zebra", zebra_map)
    
    # 3. Merge pothole dataset (ID 0 -> 6: pothole)
    pothole_map = {0: 6}
    copy_and_remap(POTHOLE_DIR, "pothole", pothole_map)
    
    # 4. Generate master data.yaml
    create_data_yaml()
    
    # 5. Verify counts
    verify_dataset()
    print("\nMerge successfully completed!")

if __name__ == "__main__":
    main()
