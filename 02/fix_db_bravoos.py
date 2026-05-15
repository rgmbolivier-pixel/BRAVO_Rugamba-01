import psycopg2
import sys

try:
    conn = psycopg2.connect(dbname='bravoos_db', user='bravoos_user', password='BravoOS@2024Secure!', host='localhost', port=5432)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("GRANT ALL ON SCHEMA public TO bravoos_user;")
    print("Successfully granted permissions using bravoos_user!")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Failed: {e}")
    sys.exit(1)
