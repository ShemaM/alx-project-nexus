#!/usr/bin/env bash
# =============================================================================
# Render Build Script — BYN-K Django Backend
# Runs automatically during every Render deployment.
# =============================================================================
set -o errexit   # exit immediately if any command fails

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Running database migrations ==="
python manage.py migrate --no-input

echo "=== Collecting static files ==="
python manage.py collectstatic --no-input

echo "=== Creating superuser (if credentials provided) ==="
python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', '').strip()
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '').strip()
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '').strip()
if username and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f'Superuser created.')
    else:
        print(f'Superuser already exists. Skipped.')
else:
    print('No superuser credentials set — skipping.')
"

echo "=== Build complete ==="
