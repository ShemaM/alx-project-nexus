#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# 1. Ensure Admin User Exists (The Robust Fix)
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); u, created = User.objects.get_or_create(username='nmshema', defaults={'email': 'shemamanase992@gmail.com'}); u.set_password('Nm&&668852'); u.is_staff=True; u.is_superuser=True; u.save()"

# 2. ⬇️ LOAD YOUR DATA (Listings & Opportunities)
python manage.py loaddata data.json