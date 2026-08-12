from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI application (the engine of our API)
app = FastAPI(
    title="SwasthiQ EOD Agent API",
    description="API for clinic billing reconciliation and narrative generation",
    version="1.0.0"
)

# CORS Setup: Allow the React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In a real production app, this would be locked down to the frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running!"}