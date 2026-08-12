import json
from typing import List, Dict, Any
from pydantic import ValidationError
from app.models.schemas import BillingRow

class DataValidationError(Exception):
    """Custom exception for returning structured 400 errors instead of 500s."""
    def __init__(self, message: str, errors: List[Dict[str, Any]]):
        self.message = message
        self.errors = errors
        super().__init__(self.message)

def parse_billing_log(file_path: str) -> List[BillingRow]:
    """Reads the JSON log and validates every row against our strict schema."""
    with open(file_path, 'r') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            raise DataValidationError("Invalid JSON file format", [])

    validated_rows = []
    malformed_errors = []

    # If the file is completely empty (like the Day 07-26 edge case), this loop just skips and returns [] safely.
    for index, row in enumerate(data):
        try:
            # We attempt to instantiate our Pydantic model. 
            # If a field is missing (like payment_mode) or mistyped, it throws a ValidationError.
            validated_row = BillingRow(**row)
            validated_rows.append(validated_row)
        except ValidationError as e:
            # Extract exactly which field failed and why
            error_details = [{"field": err["loc"][-1], "message": err["msg"]} for err in e.errors()]
            malformed_errors.append({"row_index": index, "errors": error_details})

    if malformed_errors:
        # We catch bad data immediately and raise our custom exception with the exact index and field.
        raise DataValidationError("Malformed rows detected", malformed_errors)

    return validated_rows