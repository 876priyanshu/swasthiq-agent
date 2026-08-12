# SwasthiQ EOD Analytics Agent

A full-stack diagnostic and analytics dashboard designed to process End-of-Day (EOD) clinic billing logs. The system strictly validates financial data, computes deterministic reconciliation metrics, and provides a mathematically grounded AI-generated daily summary.

##  Architecture & Stack
*   **Backend:** Python, FastAPI, Pydantic, Uvicorn
*   **Frontend:** React, Vite, Tailwind CSS, Recharts
*   **AI Integration:** Groq API (Llama-3.1-8b-instant)

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

