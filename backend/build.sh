#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static files (CSS/Images)
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate

# ⬇️ UPGRADE 'nmshema' TO ADMIN
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); u = User.objects.get(username='nmshema'); u.is_staff=True; u.is_superuser=True; u.save()"