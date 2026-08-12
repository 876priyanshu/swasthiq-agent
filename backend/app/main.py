from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from app.services.parser import parse_billing_log, DataValidationError
from app.services.reconciliation import compute_eod_reconciliation
from app.services.analytics import compute_analytics
from app.services.narrative import generate_narrative # NEW IMPORT

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

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running!"}

@app.post("/api/v1/process-log")
async def process_billing_log(file: UploadFile = File(...)):
    temp_path = os.path.join(TEMP_DIR, file.filename)
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        validated_rows = parse_billing_log(temp_path)
        reconciliation = compute_eod_reconciliation(validated_rows)
        analytics = compute_analytics(validated_rows)

        # Combine deterministic data to feed the LLM
        report_payload = {
            "reconciliation": reconciliation,
            "analytics": analytics
        }

        # Step 4: Generate Grounded Narrative
        narrative_data = generate_narrative(report_payload)

        return {
            "status": "success",
            "data": {
                **report_payload,
                "narrative": narrative_data["narrative"],
                "traced_figures": narrative_data["traced_figures"]
            }
        }

    except DataValidationError as e:
        raise HTTPException(status_code=400, detail={"message": e.message, "errors": e.errors})
        
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)