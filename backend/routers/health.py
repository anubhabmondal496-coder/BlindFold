from fastapi import APIRouter
from backend.models_service import manager
import time

router = APIRouter(prefix="/api/v1", tags=["Health"])
start_time = time.time()

@router.get("/health")
def health_check():
    uptime_seconds = int(time.time() - start_time)
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "service": "BlindFold AI Vision & Distance API",
            "uptime_seconds": uptime_seconds,
            "models": {
                "yolo_obstacle_detector": "ready" if manager.is_yolo_loaded else "unloaded",
                "currency_classifier": "ready" if manager.is_currency_loaded else "unloaded",
            },
            "audio_friendly_message": "Vision system online and fully functional."
        }
    }
