from django.core.management.base import BaseCommand
from apps.inventory.models import Branch, Category, Product, StockItem
from apps.accounts.models import User
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        
        # 1. Create Admin User if not exists
        admin_email = 'admin@bravoos.az'
        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_superuser(admin_email, 'BravoOS@2024!')
            self.stdout.write(f'Created superuser: {admin_email}')

        # 2. Create Branches
        branches = [
            {'name': 'HQ', 'city': 'Baku', 'address': 'Nizami 1', 'branch_code': 'HQ-001'},
            {'name': 'Downtown Store', 'city': 'Baku', 'address': 'Fountains Square', 'branch_code': 'DT-002'},
            {'name': 'White City Branch', 'city': 'Baku', 'address': 'White City', 'branch_code': 'WC-003'},
        ]
        
        branch_objs = []
        for b in branches:
            obj, created = Branch.objects.get_or_create(branch_code=b['branch_code'], defaults=b)
            branch_objs.append(obj)
            if created: self.stdout.write(f'Created branch: {obj.name}')

        # 3. Create Categories
        cats = ['Dairy', 'Produce', 'Bakery', 'Meat', 'Beverages']
        cat_objs = {}
        for c in cats:
            obj, created = Category.objects.get_or_create(name=c)
            cat_objs[c] = obj
            if created: self.stdout.write(f'Created category: {c}')

        # 4. Create Products
        products_data = [
            {'name': '2% Milk', 'sku': 'MILK-001', 'cat': 'Dairy', 'price': 2.50, 'unit': 'liters'},
            {'name': 'Whole Milk', 'sku': 'MILK-002', 'cat': 'Dairy', 'price': 2.80, 'unit': 'liters'},
            {'name': 'Greek Yogurt', 'sku': 'YOG-001', 'cat': 'Dairy', 'price': 3.20, 'unit': 'units'},
            {'name': 'Tomatoes', 'sku': 'PROD-001', 'cat': 'Produce', 'price': 1.50, 'unit': 'kg'},
            {'name': 'Sourdough Bread', 'sku': 'BAKE-001', 'cat': 'Bakery', 'price': 4.00, 'unit': 'units'},
        ]
        
        prod_objs = []
        for p in products_data:
            obj, created = Product.objects.get_or_create(
                sku=p['sku'],
                defaults={
                    'name': p['name'],
                    'category': cat_objs[p['cat']],
                    'cost_price': p['price'] * 0.7,
                    'selling_price': p['price'],
                    'unit': p['unit']
                }
            )
            prod_objs.append(obj)
            if created: self.stdout.write(f'Created product: {obj.name}')

        # 5. Create StockItems
        for b in branch_objs:
            for p in prod_objs:
                StockItem.objects.get_or_create(
                    product=p,
                    branch=b,
                    batch_number=f'BATCH-{random.randint(1000, 9999)}',
                    defaults={
                        'quantity': random.randint(10, 100),
                        'expiry_date': datetime.now().date() + timedelta(days=random.randint(2, 60)),
                        'storage_location': 'Main Shelf',
                        'status': 'active'
                    }
                )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
