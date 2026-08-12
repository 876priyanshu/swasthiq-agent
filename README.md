# SwasthiQ EOD Analytics Agent

A full-stack diagnostic and analytics dashboard designed to process End-of-Day (EOD) clinic billing logs. The system strictly validates financial data, computes deterministic reconciliation metrics, and provides a mathematically grounded AI-generated daily summary.

##  Architecture & Stack
*   **Backend:** Python, FastAPI, Pydantic, Uvicorn
*   **Frontend:** React, Vite, Tailwind CSS, Recharts
*   **AI Integration:** Groq API (Llama-3.1-8b-instant)

##  Live Application
* **Frontend:** https://swasthiq-agent-app.vercel.app
* **Backend API:** https://swasthiq-agent-backend.onrender.com

##  REST API Structure
The backend exposes a streamlined, stateless REST architecture designed for single-pass processing:

* **`GET /health`**
  * **Purpose:** Infrastructure health check and ping endpoint.
* **`POST /api/v1/process-log`**
  * **Payload:** `multipart/form-data` (Accepts `.json` log files).
  * **Response (200 OK):** Returns a unified, strictly typed JSON object containing `reconciliation` (financial aggregates), `analytics` (peak hours, top medicines), and `narrative` (the grounded AI summary).
  * **Response (400 Bad Request):** Returns detailed Pydantic validation errors if the uploaded data violates schema constraints.

##  Ensuring Data Consistency
To prevent database corruption and ensure state consistency, the Python backend employs a strict "all-or-nothing" validation architecture:
1. **Schema Enforcement:** Every row of the incoming JSON log is mapped to a Pydantic model (`LogEntry`). Field types (e.g., `amount_paid_paise` as integers) and enums (e.g., `payment_mode` as 'cash', 'card', 'upi') are strictly enforced.
2. **Atomic Processing:** The system processes the file in memory. If a single row is malformed or missing a required field, the entire parsing operation halts immediately. It throws a `DataValidationError` rather than silently skipping the row, ensuring partial or corrupt data never influences the aggregated metrics.
3. **Deterministic Pre-calculation:** All financial aggregations are computed deterministically *before* the LLM is invoked, ensuring the "source of truth" remains immutable and consistent regardless of AI behavior.

##  Core Engineering Features

### 1. Strict Validation Pipeline
Built with defensive engineering principles, the parsing engine uses Pydantic to strictly type-check incoming JSON logs. Instead of crashing with a generic 500 server error on corrupt data (e.g., missing fields like `payment_mode`), the system halts parsing, raises a custom `DataValidationError`, and safely passes a 400 status with actionable feedback to the UI.

### 2. Deterministic Reconciliation & Analytics
The backend engine performs highly accurate, rule-based aggregations to calculate:
*   Total billed, collected, and outstanding amounts.
*   Total refunds and payment-mode breakdowns.
*   Analytics such as peak revenue hours and top-selling medicines (by quantity and revenue).

### 3. "Zero-Hallucination" Grounded AI
The narrative summary integrates the speed of the Groq API with a strict deterministic grounding engine. 
*   **Truth Set:** The backend flattens all calculated metrics into a verified truth set.
*   **Regex Extraction:** The system parses the LLM's raw text output to extract every numeric value.
*   **Verification:** Extracted numbers are strictly cross-referenced against the truth set. If the LLM invents a number, the system throws a `GroundingError` and retries, ensuring the final narrative displayed to the user is 100% factually accurate.

### 4. Graceful Fallback Mechanisms
If the Groq API key is missing, rate-limited, or fails the strict grounding checks after maximum retries, the backend gracefully catches the exception. It falls back to a locally generated, programmatic summary, ensuring the React UI remains fully functional and informative under all network conditions.

