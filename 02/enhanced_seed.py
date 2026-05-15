import os
import django
import uuid
import random
from datetime import datetime, timedelta
from django.contrib.auth.hashers import make_password

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bravoos.settings')
django.setup()

from apps.supply_chain.models import Vendor, PurchaseOrder, Invoice
from apps.inventory.models import Branch, Product, Category, StockItem, Alert
from apps.waste_management.models import WasteRecord
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_enhanced():
    print("Starting enhanced seeding...")

    # 1. ADD MORE BRANCHES
    branches_data = [
        {'branch_code': 'B011', 'name': 'Khatai Center', 'name_az': 'Xətai Mərkəzi', 'city': 'Baku', 'city_az': 'Bakı', 'address': 'Khatai district, 15', 'address_az': 'Xətai rayonu, 15', 'phone': '+994 12 555 0110', 'email': 'khatai@bravoos.az'},
        {'branch_code': 'B012', 'name': 'Yasamal', 'name_az': 'Yasamal', 'city': 'Baku', 'city_az': 'Bakı', 'address': 'Yasamal district, 42', 'address_az': 'Yasamal rayonu, 42', 'phone': '+994 12 555 0111', 'email': 'yasamal@bravoos.az'},
        {'branch_code': 'B013', 'name': 'Narimanov', 'name_az': 'Nərimanov', 'city': 'Baku', 'city_az': 'Bakı', 'address': 'Narimanov district, 8', 'address_az': 'Nərimanov rayonu, 8', 'phone': '+994 12 555 0112', 'email': 'narimanov@bravoos.az'},
        {'branch_code': 'B014', 'name': 'Baku Airport', 'name_az': 'Bakı Hava Limanı', 'city': 'Baku', 'city_az': 'Bakı', 'address': 'Heydar Aliyev International Airport', 'address_az': 'Heydər Əliyev Beynəlxalq Hava Limanı', 'phone': '+994 12 555 0113', 'email': 'airport@bravoos.az'},
        {'branch_code': 'B015', 'name': 'Khirdalan', 'name_az': 'Xırdalan', 'city': 'Khirdalan', 'city_az': 'Xırdalan', 'address': 'Central Street, 23', 'address_az': 'Mərkəzi küçə, 23', 'phone': '+994 18 555 0114', 'email': 'khirdalan@bravoos.az'},
        {'branch_code': 'B016', 'name': 'Shamakhi', 'name_az': 'Şamaxı', 'city': 'Shamakhi', 'city_az': 'Şamaxı', 'address': 'Heydar Aliyev Ave, 45', 'address_az': 'Heydər Əliyev prospekti, 45', 'phone': '+994 20 555 0115', 'email': 'shamakhi@bravoos.az'},
        {'branch_code': 'B017', 'name': 'Quba', 'name_az': 'Quba', 'city': 'Quba', 'city_az': 'Quba', 'address': 'Khinaliq Road, 12', 'address_az': 'Xınalıq yolu, 12', 'phone': '+994 23 555 0116', 'email': 'quba@bravoos.az'},
        {'branch_code': 'B018', 'name': 'Sabirabad', 'name_az': 'Sabirabad', 'city': 'Sabirabad', 'city_az': 'Sabirabad', 'address': 'Central Bazaar, 34', 'address_az': 'Mərkəzi Bazar, 34', 'phone': '+994 21 555 0117', 'email': 'sabirabad@bravoos.az'},
        {'branch_code': 'B019', 'name': 'Agdas', 'name_az': 'Ağdaş', 'city': 'Agdas', 'city_az': 'Ağdaş', 'address': 'Nizami Street, 56', 'address_az': 'Nizami küçəsi, 56', 'phone': '+994 21 555 0118', 'email': 'agdas@bravoos.az'},
        {'branch_code': 'B020', 'name': 'Beylagan', 'name_az': 'Beyləqan', 'city': 'Beylagan', 'city_az': 'Beyləqan', 'address': 'Victory Ave, 78', 'address_az': 'Zəfər prospekti, 78', 'phone': '+994 21 555 0119', 'email': 'beylagan@bravoos.az'},
    ]
    
    branch_objs = {}
    for b in branches_data:
        obj, created = Branch.objects.get_or_create(branch_code=b['branch_code'], defaults=b)
        branch_objs[b['branch_code']] = obj
        if created: print(f"Created branch: {b['name']}")

    # 2. ADD MORE CATEGORIES
    cat_data = [
        {'name': 'Frozen', 'name_az': 'Dondurulmuş', 'description': 'Frozen vegetables, meat, ice cream'},
        {'name': 'Grocery', 'name_az': 'Ərzaq', 'description': 'Dry goods, canned foods, rice, pasta'},
        {'name': 'Beverages', 'name_az': 'İçkilər', 'description': 'Water, juices, tea, coffee'},
    ]
    category_objs = {}
    # Get existing ones too
    for c in Category.objects.all():
        category_objs[c.name] = c
        
    for c in cat_data:
        obj, created = Category.objects.get_or_create(name=c['name'], defaults=c)
        category_objs[c['name']] = obj
        if created: print(f"Created category: {c['name']}")

    # 3. ADD MORE PRODUCTS
    products_data = [
        # Dairy
        {'sku': 'MILK-003', 'barcode': '5001234567915', 'name': 'Lactose-Free Milk', 'name_az': 'Laktozasız Süd', 'category': 'Dairy', 'unit': 'liter', 'unit_az': 'litr', 'cost_price': 3.00, 'selling_price': 4.99, 'is_perishable': True, 'shelf_life_days': 14},
        {'sku': 'YOGURT-002', 'barcode': '5001234567916', 'name': 'Probiotic Yogurt', 'name_az': 'Probiotik Yoqurt', 'category': 'Dairy', 'unit': 'pack', 'unit_az': 'paket', 'cost_price': 2.20, 'selling_price': 3.49, 'is_perishable': True, 'shelf_life_days': 21},
        {'sku': 'CHEESE-003', 'barcode': '5001234567918', 'name': 'Feta Cheese', 'name_az': 'Feta Pendiri', 'category': 'Dairy', 'unit': 'kg', 'unit_az': 'kq', 'cost_price': 6.00, 'selling_price': 11.99, 'is_perishable': True, 'shelf_life_days': 45},
        # Produce
        {'sku': 'POMEGRANATE-001', 'barcode': '5001234567921', 'name': 'Fresh Pomegranate', 'name_az': 'Təzə Nar', 'category': 'Produce', 'unit': 'kg', 'unit_az': 'kq', 'cost_price': 2.50, 'selling_price': 4.99, 'is_perishable': True, 'shelf_life_days': 30},
        {'sku': 'PERSIMMON-001', 'barcode': '5001234567922', 'name': 'Persimmon', 'name_az': 'Xurma', 'category': 'Produce', 'unit': 'kg', 'unit_az': 'kq', 'cost_price': 2.00, 'selling_price': 3.99, 'is_perishable': True, 'shelf_life_days': 14},
        # Bakery
        {'sku': 'BREAD-004', 'barcode': '5001234567931', 'name': 'Whole Wheat Bread', 'name_az': 'Tam Taxıllı Çörək', 'category': 'Bakery', 'unit': 'unit', 'unit_az': 'ədəd', 'cost_price': 0.90, 'selling_price': 1.79, 'is_perishable': True, 'shelf_life_days': 3},
        {'sku': 'PASTRY-001', 'barcode': '5001234567934', 'name': 'Baklava', 'name_az': 'Paxlava', 'category': 'Bakery', 'unit': 'kg', 'unit_az': 'kq', 'cost_price': 8.00, 'selling_price': 14.99, 'is_perishable': True, 'shelf_life_days': 7},
        # Meat
        {'sku': 'CHICKEN-002', 'barcode': '5001234567939', 'name': 'Chicken Thighs', 'name_az': 'Toyuq Butu', 'category': 'Meat', 'unit': 'kg', 'unit_az': 'kq', 'cost_price': 4.50, 'selling_price': 7.99, 'is_perishable': True, 'shelf_life_days': 3},
        # Beverages
        {'sku': 'WATER-002', 'barcode': '5001234567945', 'name': 'Sparkling Water', 'name_az': 'Qazlı Su', 'category': 'Beverages', 'unit': 'liter', 'unit_az': 'litr', 'cost_price': 0.40, 'selling_price': 1.19, 'is_perishable': False, 'shelf_life_days': 365},
        {'sku': 'TEA-001', 'barcode': '5001234567950', 'name': 'Black Tea', 'name_az': 'Qara Çay', 'category': 'Beverages', 'unit': 'pack', 'unit_az': 'paket', 'cost_price': 3.00, 'selling_price': 5.99, 'is_perishable': False, 'shelf_life_days': 365},
        # Frozen
        {'sku': 'FROZEN-VEG-001', 'barcode': '5001234567953', 'name': 'Frozen Mixed Vegetables', 'name_az': 'Dondurulmuş Qarışıq Tərəvəz', 'category': 'Frozen', 'unit': 'kg', 'unit_az': 'kq', 'cost_price': 2.00, 'selling_price': 3.99, 'is_perishable': False, 'shelf_life_days': 180},
        # Grocery
        {'sku': 'RICE-001', 'barcode': '5001234567961', 'name': 'Basmati Rice', 'name_az': 'Basmati Düyü', 'category': 'Grocery', 'unit': 'kg', 'unit_az': 'kq', 'cost_price': 2.50, 'selling_price': 4.99, 'is_perishable': False, 'shelf_life_days': 365},
        {'sku': 'OIL-001', 'barcode': '5001234567967', 'name': 'Sunflower Oil', 'name_az': 'Günəbaxan Yağı', 'category': 'Grocery', 'unit': 'liter', 'unit_az': 'litr', 'cost_price': 2.00, 'selling_price': 3.99, 'is_perishable': False, 'shelf_life_days': 365},
    ]
    
    product_objs = []
    for p in products_data:
        cat_name = p.pop('category')
        p['category'] = category_objs[cat_name]
        obj, created = Product.objects.get_or_create(sku=p['sku'], defaults=p)
        product_objs.append(obj)
        if created: print(f"Created product: {p['name']}")

    # 4. ADD MORE USERS
    # Store Managers
    managers = [
        {'email': 'manager.khatai@bravoos.az', 'full_name': 'Rustam Mammadov', 'full_name_az': 'Rüstəm Məmmədov', 'role': 'manager', 'branch': 'B011'},
        {'email': 'manager.yasamal@bravoos.az', 'full_name': 'Zeynab Hasanova', 'full_name_az': 'Zeynəb Həsənova', 'role': 'manager', 'branch': 'B012'},
        {'email': 'manager.narimanov@bravoos.az', 'full_name': 'Vugar Aliyev', 'full_name_az': 'Vüqar Əliyev', 'role': 'manager', 'branch': 'B013'},
    ]
    
    for m in managers:
        branch_code = m.pop('branch')
        m['branch'] = branch_objs[branch_code]
        if not User.objects.filter(email=m['email']).exists():
            user = User.objects.create_user(password='BravoOS@2024!', **m)
            print(f"Created manager: {m['full_name']}")

    # 5. ADD VENDORS
    vendors_data = [
        {'vendor_code': 'V006', 'name': 'BakuFruit LLC', 'name_az': 'BakıMeyvə MMC', 'contact_person': 'Hasan Aliyev', 'email': 'orders@bakufruit.az', 'phone': '+994 12 555 2000', 'payment_terms': 'Net 15', 'categories': ['Produce'], 'tax_number': 'AZ9876543210', 'lead_time': 2},
        {'vendor_code': 'V007', 'name': 'Caucasian Meat Prod', 'name_az': 'Qafqaz Ət Məhsulları', 'contact_person': 'Rashad Hasanov', 'email': 'sales@caucasianmeat.az', 'phone': '+994 12 555 2001', 'payment_terms': 'Net 30', 'categories': ['Meat'], 'tax_number': 'AZ9876543211', 'lead_time': 2},
    ]
    
    for v in vendors_data:
        obj, created = Vendor.objects.get_or_create(vendor_code=v['vendor_code'], defaults=v)
        if created: print(f"Created vendor: {v['name']}")

    # 6. ADD STOCK ITEMS
    print("Generating stock items...")
    selected_branches = ['B011', 'B012', 'B013', 'B014', 'B015']
    stock_objs = []
    for b_code in selected_branches:
        branch = branch_objs[b_code]
        for product in random.sample(product_objs, 8):
            # Create a stock item
            qty = random.randint(20, 120)
            # Some expire soon, some later
            days_to_expiry = random.randint(1, 30)
            expiry = datetime.now().date() + timedelta(days=days_to_expiry)
            
            stock, created = StockItem.objects.get_or_create(
                product=product,
                branch=branch,
                batch_number=f'BATCH-{uuid.uuid4().hex[:6].upper()}',
                defaults={
                    'quantity': qty,
                    'received_quantity': qty,
                    'expiry_date': expiry,
                    'storage_location': 'Cooler Section A' if product.is_perishable else 'Shelf Rack 1'
                }
            )
            stock_objs.append(stock)

    # 7. ADD ALERTS
    print("Generating alerts...")
    for si in stock_objs:
        days_left = (si.expiry_date - datetime.now().date()).days
        if days_left <= 7:
            level = 'critical' if days_left <= 2 else 'high' if days_left <= 5 else 'medium'
            Alert.objects.get_or_create(
                stock_item=si,
                defaults={
                    'branch': si.branch,
                    'product': si.product,
                    'alert_level': level,
                    'quantity_at_risk': si.quantity,
                    'estimated_loss': si.quantity * si.product.cost_price,
                    'expiry_days_left': days_left,
                    'ai_recommendation': f"System recommends immediate action for {si.product.name} at {si.branch.name}. High risk of spoilage.",
                    'recommended_action': 'DISCOUNT' if days_left > 2 else 'DONATE',
                    'confidence_score': random.randint(85, 98),
                    'status': 'active'
                }
            )

    # 8. ADD WASTE RECORDS
    print("Generating waste records...")
    staff_user = User.objects.filter(role='staff').first() or User.objects.filter(role='admin').first()
    for si in random.sample(stock_objs, 10):
        WasteRecord.objects.create(
            branch=si.branch,
            stock_item=si,
            quantity=random.randint(1, 10),
            reason=random.choice(['expired', 'damaged', 'quality_issues']),
            notes="Added during automated seeding",
            logged_by=staff_user
        )

    print("Enhanced seeding complete!")

if __name__ == '__main__':
    seed_enhanced()
