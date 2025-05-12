
"""
Emotion detection API endpoints
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import numpy as np
import cv2
import tempfile
import os
from typing import Optional

from ..services.facial_emotion import create_detector as create_facial_detector
from ..services.audio_emotion import create_detector as create_audio_detector

router = APIRouter(prefix="/api/emotions", tags=["emotions"])

# Create detector instances
facial_detector = create_facial_detector("trained_models/facial_emotion_model.h5")
audio_detector = create_audio_detector("trained_models/audio_emotion_model.h5")

@router.post("/facial")
async def detect_facial_emotion(file: UploadFile = File(...)):
    """
    Detect emotions in a facial image.
    
    Args:
        file: Image file to analyze
        
    Returns:
        Emotion detection results
    """
    try:
        # Read and decode the image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Detect emotions
        result = facial_detector.detect_emotion(image)
        
        # Check for errors
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return JSONResponse(content=result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/audio")
async def detect_audio_emotion(file: UploadFile = File(...)):
    """
    Detect emotions in an audio file.
    
    Args:
        file: Audio file to analyze (WAV format)
        
    Returns:
        Emotion detection results
    """
    try:
        # Save the file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name
        
        try:
            # Detect emotions
            result = audio_detector.detect_emotion(temp_path)
            
            # Check for errors
            if "error" in result:
                raise HTTPException(status_code=400, detail=result["error"])
            
            return JSONResponse(content=result)
        finally:
            # Clean up the temporary file
            os.unlink(temp_path)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
