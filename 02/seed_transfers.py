import os
import django
import uuid
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bravoos.settings')
django.setup()

from apps.inventory.models import Branch, Product, Transfer, StockItem

def seed_transfers():
    branches = list(Branch.objects.all())
    products = list(Product.objects.all())
    
    if len(branches) < 2 or not products:
        print("Not enough branches or products to seed transfers.")
        return

    transfers = [
        {
            'from_branch': branches[0],
            'to_branch': branches[1],
            'product': products[0],
            'quantity': 50,
            'status': 'delivered',
            'reason': 'Excess stock - preventing waste',
            'driver_name': 'Ali M.',
            'eta': 'Arrived',
            'delivered_at': datetime.now() - timedelta(hours=2)
        },
        {
            'from_branch': branches[1],
            'to_branch': branches[0],
            'product': products[1] if len(products) > 1 else products[0],
            'quantity': 30,
            'status': 'in_transit',
            'reason': 'Stock shortage at Downtown',
            'driver_name': 'Vugar R.',
            'eta': '45 mins',
        },
        {
            'from_branch': branches[0],
            'to_branch': branches[1],
            'product': products[0],
            'quantity': 20,
            'status': 'pending',
            'reason': 'AI Recommendation: High demand at target',
        }
    ]

    for t_data in transfers:
        Transfer.objects.create(**t_data)
        print(f"Created transfer: {t_data['product'].name} from {t_data['from_branch'].name} to {t_data['to_branch'].name}")

if __name__ == '__main__':
    seed_transfers()
