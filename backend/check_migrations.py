import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()
cursor.execute("SELECT * FROM django_migrations WHERE app = 'listings';")
rows = cursor.fetchall()
for row in rows:
    print(f"ID: {row[0]}, App: {row[1]}, Name: {row[2]}, Applied: {row[3]}")
conn.close()
