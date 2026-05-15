import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bravoos.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.inventory.models import Branch

User = get_user_model()

# Get first available branch for staff
branch = Branch.objects.first()
print(f"Using branch: {branch}")

# Create a store staff user
if not User.objects.filter(email='staff.downtown@bravoos.az').exists():
    User.objects.create_user(
        email='staff.downtown@bravoos.az',
        password='BravoOS@2024!',
        full_name='Sara Johnson',
        role='staff',
        branch=branch,
        status='active'
    )
    print("Created staff user: staff.downtown@bravoos.az")
else:
    print("Staff user already exists.")

# Also reset manager passwords in case they need it
for email in ['manager.khatai@bravoos.az', 'manager.yasamal@bravoos.az']:
    try:
        u = User.objects.get(email=email)
        u.set_password('BravoOS@2024!')
        u.save()
        print(f"Password confirmed for: {email}")
    except User.DoesNotExist:
        pass

# Also make sure admin works
for email in ['admin@bravoos.az']:
    try:
        u = User.objects.get(email=email)
        u.set_password('BravoOS@2024!')
        u.role = 'admin'
        u.save()
        print(f"Admin password set for: {email}")
    except User.DoesNotExist:
        pass

print("\n=== ALL LOGIN CREDENTIALS ===")
print(f"{'ROLE':<12} | {'EMAIL':<45} | PASSWORD")
print("-" * 80)
for u in User.objects.all().order_by('role'):
    role = 'ADMIN' if u.is_superuser or u.role == 'admin' else u.role.upper()
    print(f"{role:<12} | {u.email:<45} | BravoOS@2024!")
