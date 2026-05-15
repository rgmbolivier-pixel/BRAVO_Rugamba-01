import os
import psycopg2
from psycopg2 import sql
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv('DB_NAME', 'bravoos_db')
DB_USER = os.getenv('DB_USER', 'bravoos_user')
DB_PASS = os.getenv('DB_PASSWORD', 'BravoOS@2024Secure!')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')

def get_db_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )

def get_table_schema(cur, table):
    cur.execute(f"""
        SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
        FROM information_schema.columns
        WHERE table_name = '{table}'
        ORDER BY ordinal_position;
    """)
    cols = cur.fetchall()
    
    col_defs = []
    for col in cols:
        name, dtype, nullable, default, char_len = col
        definition = f"{name} {dtype}"
        if char_len:
            definition += f"({char_len})"
        if nullable == 'NO':
            definition += " NOT NULL"
        if default:
            definition += f" DEFAULT {default}"
        col_defs.append(definition)
    
    return f"CREATE TABLE {table} (\n    " + ",\n    ".join(col_defs) + "\n);"

def generate_dump():
    conn = get_db_connection()
    cur = conn.cursor()

    output = []
    output.append("# BravoOS Database Setup Guide\n")
    output.append("Use this guide to recreate the BravoOS database and data in pgAdmin on a new computer.\n")
    
    output.append("## Part 1: Initial Setup\n")
    output.append("Run this block in pgAdmin Query Tool (while connected to the `postgres` database):\n")
    output.append("```sql")
    output.append(f"CREATE DATABASE {DB_NAME};\n")
    output.append(f"-- IMPORTANT: After running above, open a NEW Query Tool window")
    output.append(f"-- connected to the newly created '{DB_NAME}' database before running the rest.")
    output.append("```\n")

    output.append("## Part 2: Table Structures (Schema)\n")
    output.append("Run this block to create all tables.\n")
    output.append("```sql")

    # Get all tables
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE 'django_%'
        AND table_name NOT LIKE 'auth_%'
        ORDER BY table_name;
    """)
    tables = [row[0] for row in cur.fetchall()]

    for table in tables:
        output.append(f"-- Table: {table}")
        output.append(get_table_schema(cur, table))
        output.append("")
    
    output.append("```\n")

    output.append("## Part 3: Data Inserts\n")
    output.append("Run these blocks to populate the database with real data.\n")

    for table in tables:
        output.append(f"### Data for {table}")
        output.append("```sql")
        
        # Get column names
        cur.execute(sql.SQL("SELECT * FROM {} LIMIT 0").format(sql.Identifier(table)))
        colnames = [desc[0] for desc in cur.description]
        
        # Get data
        cur.execute(sql.SQL("SELECT * FROM {}").format(sql.Identifier(table)))
        rows = cur.fetchall()
        
        if rows:
            for row in rows:
                values = []
                for val in row:
                    if val is None:
                        values.append("NULL")
                    elif isinstance(val, (int, float)):
                        values.append(str(val))
                    elif isinstance(val, bool):
                        values.append(str(val).upper())
                    else:
                        escaped_val = str(val).replace("'", "''")
                        values.append(f"'{escaped_val}'")
                
                query = f"INSERT INTO {table} ({', '.join(colnames)}) VALUES ({', '.join(values)});"
                output.append(query)
        else:
            output.append(f"-- No data in {table}")
            
        output.append("```\n")

    cur.close()
    conn.close()

    with open("database_setup.md", "w", encoding="utf-8") as f:
        f.write("\n".join(output))

if __name__ == "__main__":
    try:
        generate_dump()
        print("Successfully generated database_setup.md")
    except Exception as e:
        print(f"Error: {e}")
