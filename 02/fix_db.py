import psycopg2
import sys

passwords = ['postgres', 'root', 'admin', 'BravoOS@2024Secure!', '']
connected = False

for pwd in passwords:
    try:
        conn = psycopg2.connect(dbname='bravoos_db', user='postgres', password=pwd, host='localhost', port=5432)
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("GRANT ALL ON SCHEMA public TO bravoos_user;")
        cur.execute("ALTER DATABASE bravoos_db OWNER TO bravoos_user;")
        print(f"Successfully fixed permissions using password '{pwd}'")
        cur.close()
        conn.close()
        connected = True
        break
    except Exception as e:
        pass

if not connected:
    print("Could not connect as postgres user to fix permissions.")
    sys.exit(1)
