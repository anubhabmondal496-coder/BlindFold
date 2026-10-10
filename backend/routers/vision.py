"""
BlindFold - Vision & Distance Estimation Router
Handles camera frame upload for:
1. Obstacle & Hazard distance detection (YOLOv8 + pinhole geometry)
2. Banknote denomination classification (CNN)
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from backend.models_service import manager

router = APIRouter(prefix="/api/v1/vision", tags=["Vision & Inference"])

@router.post("/detect-obstacles")
async def detect_obstacles(
    file: UploadFile = File(...),
    confidence: float = Query(0.35, ge=0.1, le=1.0)
):
    try:
        content = await file.read()
        if len(content) < 100:
            raise HTTPException(
                status_code=422,
                detail="Empty or corrupted image frame received."
            )
        
        result = manager.detect_obstacles(content, confidence_threshold=confidence)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "OBSTACLE_DETECTION_ERROR",
                "message": str(e),
                "audio_friendly_message": "Vision system encountered a temporary glitch. Retrying."
            }
        )

@router.post("/classify-currency")
async def classify_currency(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if len(content) < 100:
            raise HTTPException(
                status_code=422,
                detail="Empty or corrupted image received."
            )

        result = manager.classify_currency(content)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "CURRENCY_CLASSIFICATION_ERROR",
                "message": str(e),
                "audio_friendly_message": "Could not identify banknote. Please hold steady."
            }
        )
