"""
BlindFold - First-Time User Guidance & Gesture Specification Router
Derived from doc_for_blindfold.docx requirements.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/guidance", tags=["Guidance & Gestures"])

class GuidanceResponse(BaseModel):
    is_first_time: bool
    spoken_welcome: str
    gestures: dict
    audio_steps: list[str]

@router.get("/first-time")
def get_first_time_guidance(first_time: bool = True):
    welcome_text = (
        "Welcome to BlindFold. This app assists your daily navigation and currency identification. "
        "Here are your primary controls: Single tap anywhere on the screen to activate Obstacle Radar mode. "
        "Double tap anywhere on the screen to activate Currency Reader mode. "
        "Use the large bottom button anytime to speak to your Voice Assistant. "
        "You can tap now to begin."
    )

    return {
        "success": True,
        "data": {
            "is_first_time": first_time,
            "spoken_welcome": welcome_text,
            "gestures": {
                "single_tap": {
                    "action": "ACTIVATE_OBSTACLE_MODE",
                    "label": "Obstacle & Distance Radar",
                    "spoken_confirm": "Obstacle Radar activated. Camera scanning forward."
                },
                "double_tap": {
                    "action": "ACTIVATE_CURRENCY_MODE",
                    "label": "Currency Scanner",
                    "spoken_confirm": "Currency Reader activated. Hold banknote flat before camera."
                },
                "voice_button": {
                    "action": "ACTIVATE_VOICE_ASSISTANT",
                    "label": "Voice Assistant",
                    "spoken_confirm": "Voice Assistant listening. What can I help you with?"
                }
            },
            "audio_steps": [
                "Step 1: Single tap for obstacle radar.",
                "Step 2: Double tap for currency detection.",
                "Step 3: Tap bottom button for voice assistant.",
            ]
        }
    }
