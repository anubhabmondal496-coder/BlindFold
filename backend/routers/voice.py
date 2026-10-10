"""
BlindFold - Voice Assistant Router
Processes user speech intents, requests, and commands from the Voice Assistant Button.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/voice", tags=["Voice Assistant"])

class VoiceAssistantRequest(BaseModel):
    query_text: str
    current_mode: str = "HOME"  # HOME, OBSTACLE_RADAR, CURRENCY_READER

@router.post("/assistant")
def process_voice_command(request: VoiceAssistantRequest):
    query = request.query_text.lower().strip()

    # Rule-based natural language intent parser for assistive navigation
    if any(k in query for k in ["ahead", "what's ahead", "obstacle", "hazard", "front", "path"]):
        intent = "CHECK_PATH"
        spoken = "Scanning path. Currently checking for obstacles and hazards."
        action = "NAVIGATE_OBSTACLES"
    elif any(k in query for k in ["money", "currency", "cash", "note", "rupee", "banknote"]):
        intent = "SCAN_CURRENCY"
        spoken = "Opening currency scanner. Hold banknote flat before camera."
        action = "NAVIGATE_CURRENCY"
    elif any(k in query for k in ["how far", "distance", "steps", "measure"]):
        intent = "MEASURE_DISTANCE"
        spoken = "Obstacle distance mode active. Closest object distance will be spoken in meters and steps."
        action = "NAVIGATE_OBSTACLES"
    elif any(k in query for k in ["help", "how to use", "instruction", "guide"]):
        intent = "GET_HELP"
        spoken = "Single tap for obstacle radar. Double tap for currency scanner. Speak anytime using this button."
        action = "ANNOUNCE_GUIDANCE"
    elif any(k in query for k in ["stop", "pause", "quiet", "mute"]):
        intent = "PAUSE_AUDIO"
        spoken = "Navigation guidance paused. Tap anytime to resume."
        action = "PAUSE"
    else:
        intent = "GENERAL_QUERY"
        spoken = f"I heard: {request.query_text}. You can ask about obstacles ahead, scan currency, or say help."
        action = "NONE"

    return {
        "success": True,
        "data": {
            "intent": intent,
            "spoken_response": spoken,
            "action": action,
            "haptic_pattern": "CONFIRM_CHIME"
        }
    }
