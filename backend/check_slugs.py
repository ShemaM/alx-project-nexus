import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()
cursor.execute("SELECT id, title, slug FROM listings_job;")
rows = cursor.fetchall()
for row in rows:
    print(f"ID: {row[0]}, Title: {row[1]}, Slug: {row[2]}")
conn.close()