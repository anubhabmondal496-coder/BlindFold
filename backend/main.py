"""
BlindFold - FastAPI Assistive Backend
Provides real-time obstacle distance estimation, banknote classification,
spoken voice assistant intent routing, and first-time user guidance.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.models_service import manager
from backend.routers import health, guidance, vision, voice, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Preload YOLO & Currency models on startup for zero-latency first inference
    print("[BlindFold Backend] Initializing ML models...")
    manager.load_models()
    print("[BlindFold Backend] Models ready. Server is online.")
    yield
    print("[BlindFold Backend] Shutting down...")

app = FastAPI(
    title="BlindFold Assistive Vision & Audio API",
    description="Real-time monocular distance estimation, hazard detection, Indian currency recognition, and voice assistance for blind users.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Flutter mobile apps and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global audio-friendly exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": str(exc),
                "audio_friendly_message": "Vision system encountered a temporary glitch. Please try again."
            }
        }
    )

# Include Routers
app.include_router(health.router)
app.include_router(guidance.router)
app.include_router(vision.router)
app.include_router(voice.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {
        "service": "BlindFold AI Vision & Distance API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "audio_friendly_message": "BlindFold service running. Ready for connection."
    }
