import torch
from ultralytics import YOLO
from pathlib import Path

def main():
    data_yaml = Path(__file__).parent / "combined_dataset" / "data.yaml"
    
    device = 0 if torch.cuda.is_available() else 'cpu'
    device_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'
    print(f"Starting training on device: {device} ({device_name})")
    
    # 1. Load pretrained YOLO nano model (choose yolov8n.pt or yolo26n.pt)
    model = YOLO("yolov8n.pt")
    
    # 2. Train on master combined dataset
    results = model.train(
        data=str(data_yaml),
        epochs=50,
        imgsz=640,
        batch=16,
        device=device,
        workers=2,
        name="blindfold_nav_combined"
    )
    
    print("\nTraining completed successfully!")
    print("Best weights saved at: runs/detect/blindfold_nav_combined/weights/best.pt")

if __name__ == "__main__":
    main()
