from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

# 1. Enums for strict validation (just like C++ enum class)
class PaymentMode(str, Enum):
    CASH = "cash"
    CARD = "card"
    UPI = "upi"

# 2. Structure for individual medicines in a visit
class LineItem(BaseModel):
    drug_name: str
    qty: int
    unit_price_paise: int

# 3. The main billing row matching the exact schema required
class BillingRow(BaseModel):
    clinic_id: str
    visit_id: str
    timestamp: datetime
    doctor_id: Optional[str] = None
    line_items: List[LineItem]
    payment_mode: PaymentMode
    amount_paid_paise: int
    discount_paise: int = 0
    is_refund: bool = False