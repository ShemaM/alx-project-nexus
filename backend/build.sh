#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static files (CSS/Images)
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate

# ⬇ Create a default admin user if it doesn't exist
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='superadmin').exists() or User.objects.create_superuser('superadmin', 'shemamanase992@gmail.com', 'Nm&&668852')"