import subprocess
import os

apps = ['accounts', 'inventory', 'supply_chain', 'waste_management', 'tasks', 'analytics', 'notifications']

def get_migrations(app):
    try:
        output = subprocess.check_output(['python', 'manage.py', 'showmigrations', app], text=True)
        migrations = []
        for line in output.splitlines():
            if '[X]' in line or '[ ]' in line:
                name = line.split('] ')[1].strip()
                migrations.append(name)
        return migrations
    except:
        return []

all_sql = []
all_sql.append("-- BRAVOOS DATABASE SCHEMA EXPORT")
all_sql.append("-- Generated via sqlmigrate\n")

# Order matters for foreign keys. 
# Usually, accounts and inventory are base.
ordered_apps = ['accounts', 'inventory', 'supply_chain', 'waste_management', 'tasks', 'analytics', 'notifications']

for app in ordered_apps:
    migrations = get_migrations(app)
    for m in migrations:
        print(f"Getting SQL for {app} {m}...")
        try:
            sql = subprocess.check_output(['python', 'manage.py', 'sqlmigrate', app, m], text=True)
            all_sql.append(f"-- App: {app}, Migration: {m}")
            all_sql.append(sql)
            all_sql.append("\n")
        except Exception as e:
            print(f"Error for {app} {m}: {e}")

with open("schema_dump.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(all_sql))
