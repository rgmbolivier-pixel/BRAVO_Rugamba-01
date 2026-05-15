import os
import django
import uuid
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bravoos.settings')
django.setup()

from apps.supply_chain.models import Vendor, PurchaseOrder, Invoice
from apps.inventory.models import Branch, Product, Category, StockItem, Alert
from django.contrib.auth import get_user_model

User = get_user_model()

def seed():
    # Ensure categories exist
    cats = ['Dairy', 'Produce', 'Bakery', 'Meat']
    cat_objs = {}
    for c in cats:
        obj, _ = Category.objects.get_or_create(name=c)
        cat_objs[c] = obj
    
    # Ensure branches exist
    branches = [
        {'name': 'HQ', 'city': 'Baku', 'address': '123 HQ St', 'branch_code': 'BR-001', 'phone': '123456'},
        {'name': 'Downtown Store', 'city': 'Baku', 'address': '456 Downtown Ave', 'branch_code': 'BR-002', 'phone': '654321'},
        {'name': 'White City Branch', 'city': 'Baku', 'address': '789 White City Blvd', 'branch_code': 'BR-003', 'phone': '987654'},
    ]
    branch_objs = []
    for b in branches:
        obj, _ = Branch.objects.get_or_create(name=b['name'], defaults=b)
        branch_objs.append(obj)

    # Ensure vendors exist
    vendors_data = [
        {'name': 'Dairy Fresh Co', 'email': 'orders@dairyfresh.az', 'categories': ['Dairy'], 'status': 'Active', 'rating': 4.2},
        {'name': 'Produce World', 'email': 'orders@produceworld.az', 'categories': ['Produce'], 'status': 'Under Review', 'rating': 3.8},
        {'name': 'Bakery Supplies AZ', 'email': 'orders@bakerysupplies.az', 'categories': ['Bakery'], 'status': 'Active', 'rating': 4.5},
    ]
    vendor_objs = []
    for v in vendors_data:
        obj, _ = Vendor.objects.get_or_create(name=v['name'], defaults=v)
        vendor_objs.append(obj)

    # Ensure products exist
    products_data = [
        {'sku': 'SKU-001', 'name': '2% Milk', 'category': cat_objs['Dairy'], 'unit': 'Unit', 'cost_price': 1.5, 'selling_price': 2.5},
        {'sku': 'SKU-002', 'name': 'Sourdough Bread', 'category': cat_objs['Bakery'], 'unit': 'Unit', 'cost_price': 0.8, 'selling_price': 1.5},
        {'sku': 'SKU-003', 'name': 'Lettuce', 'category': cat_objs['Produce'], 'unit': 'Kg', 'cost_price': 1.0, 'selling_price': 2.0},
    ]
    product_objs = []
    for p in products_data:
        obj, _ = Product.objects.get_or_create(sku=p['sku'], defaults=p)
        product_objs.append(obj)

    # Seed some stock and POs/Invoices
    for i, b in enumerate(branch_objs):
        for j, p in enumerate(product_objs):
            # Stock
            StockItem.objects.get_or_create(
                product=p,
                branch=b,
                batch_number=f"BATCH-{uuid.uuid4().hex[:6].upper()}",
                defaults={
                    'quantity': 100,
                    'expiry_date': datetime.now().date() + timedelta(days=5 if (i+j)%2 == 0 else 30),
                    'status': 'active'
                }
            )
            
            # PO
            po, _ = PurchaseOrder.objects.get_or_create(
                code=f"PO-00{i}{j}",
                defaults={
                    'vendor': vendor_objs[j % len(vendor_objs)],
                    'branch': b,
                    'amount': 1500 + (i*100) + (j*50),
                    'status': 'delivered' if (i+j) % 2 == 0 else 'pending'
                }
            )
            
            # Invoice
            Invoice.objects.get_or_create(
                code=f"INV-00{i}{j}",
                defaults={
                    'po': po,
                    'amount': po.amount,
                    'due_date': datetime.now().date() + timedelta(days=15),
                    'status': 'pending' if (i+j) % 2 == 0 else 'paid',
                    'match_status': '3-WAY MATCH COMPLETE' if (i+j) % 2 == 0 else 'DISCREPANCY DETECTED'
                }
            )

    print("Seeding complete! Triggering AI alert generation...")
    # Trigger alert generation logic directly
    from apps.analytics.gemini_service import GeminiAIService
    
    ai_service = GeminiAIService()
    threshold = datetime.now().date() + timedelta(days=14)
    expiring_items = StockItem.objects.filter(expiry_date__lte=threshold, status='active')
    
    alerts_created = 0
    for item in expiring_items:
        if Alert.objects.filter(stock_item=item, status='active').exists():
            continue
        days_left = (item.expiry_date - datetime.now().date()).days
        item_data = {
            "name": item.product.name,
            "current_stock": item.quantity,
            "expiry_date": str(item.expiry_date),
            "daily_sales_avg": 5,
            "unit_cost": float(item.product.cost_price),
            "branch": item.branch.name
        }
        try:
            ai_analysis = ai_service.generate_waste_prediction(item_data, [])
        except:
            ai_analysis = {"reasoning": "Monitor closely", "recommended_action": "discount", "confidence_score": 85}
            
        Alert.objects.create(
            stock_item=item,
            branch=item.branch,
            product=item.product,
            alert_level='critical' if days_left <= 3 else 'high',
            quantity_at_risk=item.quantity,
            estimated_loss=item.quantity * item.product.cost_price,
            expiry_days_left=days_left,
            ai_recommendation=ai_analysis.get('reasoning', 'Monitor closely'),
            recommended_action=ai_analysis.get('recommended_action', 'discount').upper(),
            confidence_score=ai_analysis.get('confidence_score', 85),
            status='active'
        )
        alerts_created += 1
    print(f"AI Alerts generated: {alerts_created}")

if __name__ == '__main__':
    seed()
