from typing import List, Dict, Any
from collections import defaultdict
from app.models.schemas import BillingRow

def compute_analytics(rows: List[BillingRow]) -> Dict[str, Any]:
    """Computes hour-of-day revenue and top medicine rankings."""
    
    # Using defaultdict is like an unordered_map that auto-initializes to 0
    revenue_by_hour = defaultdict(int)
    med_qty = defaultdict(int)
    med_revenue = defaultdict(int)

    for row in rows:
        # The prompt specifies the timestamp is in UTC and used for hour bucketing
        # We extract the 24-hour integer (0-23)
        hour = row.timestamp.hour
        
        # Calculate this visit's net revenue (billed minus discount, ignoring refunds for this specific chart based on standard POS logic)
        visit_billed = sum(item.qty * item.unit_price_paise for item in row.line_items) - row.discount_paise
        
        if not row.is_refund:
            revenue_by_hour[hour] += visit_billed

            # Tally up medicine stats
            for item in row.line_items:
                med_qty[item.drug_name] += item.qty
                med_revenue[item.drug_name] += (item.qty * item.unit_price_paise)

    # Format the hour data into a clean list of dictionaries for the React frontend
    # We want a continuous 24-hour timeline, even for hours with 0 revenue
    hourly_series = [
        {"hour": h, "revenue": revenue_by_hour.get(h, 0)}
        for h in range(24)
    ]

    # Sort medicines descending and take the top 5
    # The assignment explicitly asks for these as two distinct rankings
    top_by_qty = sorted(
        [{"name": k, "value": v} for k, v in med_qty.items()],
        key=lambda x: x["value"], 
        reverse=True
    )[:5]

    top_by_revenue = sorted(
        [{"name": k, "value": v} for k, v in med_revenue.items()],
        key=lambda x: x["value"], 
        reverse=True
    )[:5]

    return {
        "revenue_by_hour": hourly_series,
        "top_medicines_by_quantity": top_by_qty,
        "top_medicines_by_revenue": top_by_revenue
    }