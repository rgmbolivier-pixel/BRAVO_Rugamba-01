#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bravoos.settings')
django.setup()

from django.db import connection
from django.db.utils import OperationalError

try:
    # Try to establish connection
    connection.ensure_connection()
    print("✓ DATABASE CONNECTION: SUCCESS")
    print(f"✓ Database: {connection.settings_dict['NAME']}")
    print(f"✓ Host: {connection.settings_dict['HOST']}")
    print(f"✓ Port: {connection.settings_dict['PORT']}")
    print(f"✓ User: {connection.settings_dict['USER']}")
    print(f"✓ Engine: {connection.settings_dict['ENGINE']}")
    
    # Try a simple query
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        print(f"\n✓ PostgreSQL Version: {db_version[0]}")
    
    print("\n✅ ALL TESTS PASSED - Backend connected to database successfully!")
    
except OperationalError as e:
    print(f"❌ DATABASE CONNECTION FAILED")
    print(f"Error: {str(e)}")
    sys.exit(1)
except Exception as e:
    print(f"❌ UNEXPECTED ERROR: {str(e)}")
    sys.exit(1)
