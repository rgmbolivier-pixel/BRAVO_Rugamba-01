import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bravoos.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

users = User.objects.all().order_by('role').values('email', 'role', 'full_name', 'is_superuser')
print(f"{'ROLE':<12} | {'EMAIL':<45} | {'NAME'}")
print("-" * 80)
for u in users:
    role = "SUPERUSER" if u['is_superuser'] else u['role'].upper()
    print(f"{role:<12} | {u['email']:<45} | {u['full_name']}")

print(f"\nTotal users: {User.objects.count()}")
