# inventory.py
# Functions to compute reorder points and alerts

def compute_reorder_points(predictions, inventory):
    """
    Compute the quantity to reorder for each material based on current stock.
    """
    reorder = {}
    for material, qty in predictions.items():
        stock = inventory.get(material, 0)
        reorder[material] = max(0, float(qty) - stock)
    return reorder

def generate_alerts(predictions, inventory):
    """
    Generate alerts if stock is too low or too high.
    """
    alerts = []
    for material, qty in predictions.items():
        stock = inventory.get(material, 0)
        if stock < qty * 0.5:
            alerts.append(f"⚠️ Low stock alert: {material}")
        elif stock > qty * 2:
            alerts.append(f"⚠️ Overstock alert: {material}")
    return alerts
