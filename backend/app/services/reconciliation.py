from typing import List, Dict
from app.models.schemas import BillingRow, PaymentMode

def compute_eod_reconciliation(rows: List[BillingRow]) -> Dict:
    """Computes deterministic EOD metrics purely in integer paise."""
    
    # Initialize our memory structures with zero states
    metrics = {
        "total_billed": 0,
        "total_collected": 0,
        "outstanding": 0,
        "refunds": 0,
        "payment_breakdown": {
            PaymentMode.CASH.value: {"collected": 0, "refunds": 0},
            PaymentMode.CARD.value: {"collected": 0, "refunds": 0},
            PaymentMode.UPI.value: {"collected": 0, "refunds": 0},
        }
    }

    for row in rows:
        mode = row.payment_mode.value
        
        if row.is_refund:
            #  refunds are negative adjustments, so we take the absolute 
            # value to track total refund volume.
            refund_amount = abs(row.amount_paid_paise)
            metrics["refunds"] += refund_amount
            metrics["payment_breakdown"][mode]["refunds"] += refund_amount
        else:
            # Billed = (qty * price) - discount
            visit_billed = sum(item.qty * item.unit_price_paise for item in row.line_items)
            visit_billed -= row.discount_paise
            
            collected = row.amount_paid_paise
            outstanding = visit_billed - collected

            metrics["total_billed"] += visit_billed
            metrics["total_collected"] += collected
            metrics["outstanding"] += outstanding
            metrics["payment_breakdown"][mode]["collected"] += collected

    return metrics