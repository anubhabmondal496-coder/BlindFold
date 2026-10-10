"""
BlindFold - FastAPI Backend Runner
Launches the FastAPI server on port 8000.
Usage:
    python run_backend.py
    or: .\dl_env\Scripts\python.exe run_backend.py
"""

import sys
import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print(" Starting BlindFold FastAPI Assistive Server")
    print(" Host: http://0.0.0.0:8000")
    print(" Interactive Docs: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=False)
