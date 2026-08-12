from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from app.services.parser import parse_billing_log, DataValidationError
from app.services.reconciliation import compute_eod_reconciliation
from app.services.analytics import compute_analytics

app = FastAPI(
    title="SwasthiQ EOD Agent API",
    description="API for clinic billing reconciliation and narrative generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a temporary directory to store uploaded files before parsing
TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running!"}

@app.post("/api/v1/process-log")
async def process_billing_log(file: UploadFile = File(...)):
    """Endpoint to upload a JSON log, parse it, and return deterministic metrics."""
    temp_path = os.path.join(TEMP_DIR, file.filename)
    
    # Save the uploaded file locally to parse it
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Step 1: Parse and validate
        validated_rows = parse_billing_log(temp_path)
        
        # Step 2: Compute math
        reconciliation = compute_eod_reconciliation(validated_rows)
        
        # Step 3: Compute analytics
        analytics = compute_analytics(validated_rows)

        # Return the pure, deterministic payload
        return {
            "status": "success",
            "data": {
                "reconciliation": reconciliation,
                "analytics": analytics
            }
        }

    except DataValidationError as e:
        # The prompt requires rejecting malformed rows with specific, actionable errors[cite: 2]
        # We trap our custom exception and return a 400 Bad Request instead of a 500 server crash
        raise HTTPException(status_code=400, detail={"message": e.message, "errors": e.errors})
        
    finally:
        # Clean up memory/disk by removing the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)