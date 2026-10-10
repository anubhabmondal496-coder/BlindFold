"""
BlindFold - User Preferences & Accessibility Settings Router
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/users", tags=["User Preferences"])

class UserProfile(BaseModel):
    speech_rate: float = 1.0
    speech_volume: float = 1.0
    preferred_voice: str = "en-IN-Standard"
    haptics_enabled: bool = True
    vibrate_on_critical: bool = True

_current_profile = UserProfile()

@router.get("/profile")
def get_user_profile():
    return {
        "success": True,
        "data": _current_profile.model_dump()
    }

@router.put("/profile")
def update_user_profile(profile: UserProfile):
    global _current_profile
    _current_profile = profile
    return {
        "success": True,
        "data": {
            "updated": True,
            "profile": _current_profile.model_dump(),
            "spoken_confirm": "Accessibility preferences saved successfully."
        }
    }
