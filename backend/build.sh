#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# 1. ⬇️ RESTORE ADMIN: Create 'nmshema' if missing, or reset permissions if exists
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); u, created = User.objects.get_or_create(username='nmshema', defaults={'email': 'shemamanase992@gmail.com'}); u.set_password('Nm&&668852'); u.is_staff=True; u.is_superuser=True; u.save()"

# 2. ⬇️ RESTORE DATA: Load all the listings from your clean data.json file
python manage.py loaddata data.json