
"""
MindfulMe Backend API

FastAPI application for MindfulMe emotion detection services.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .routers import emotions

# Create FastAPI application
app = FastAPI(
    title="MindfulMe API",
    description="Backend API for MindfulMe emotion detection services",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(emotions.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to MindfulMe API",
        "status": "active",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
