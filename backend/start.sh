#!/usr/bin/env bash
# =============================================================================
# Render Start Script — BYN-K Django Backend
#
# Runs in the deployed environment (full network access to PostgreSQL).
# Called by Render as the startCommand on every deploy and restart.
# =============================================================================
set -o errexit

echo "=== Running database migrations ==="
python manage.py migrate --no-input

echo "=== Creating superuser (if not exists) ==="
python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', '').strip()
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '').strip()
email    = os.environ.get('DJANGO_SUPERUSER_EMAIL', '').strip()
if username and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f'Superuser {username!r} created.')
    else:
        print(f'Superuser {username!r} already exists — skipped.')
else:
    print('No superuser env vars set — skipped.')
"

echo "=== Starting gunicorn ==="
exec gunicorn config.wsgi:application \
  --workers 2 \
  --worker-class gthread \
  --worker-connections 1000 \
  --max-requests 1000 \
  --max-requests-jitter 50 \
  --timeout 120 \
  --bind 0.0.0.0:$PORT \
  --access-logfile - \
  --error-logfile -
