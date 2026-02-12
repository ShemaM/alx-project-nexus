#!/usr/bin/env bash
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static files
python manage.py collectstatic --no-input

# Fix migration state for org_logo field if column already exists
# This handles duplicate migration scenarios from parallel branch merges
python manage.py fix_org_logo_migration || true

# Run migrations
python manage.py migrate

# Optional seed data load (disabled by default to avoid fixed account bootstrap)
if [[ "${LOAD_SEED_DATA}" == "true" ]]; then
  python manage.py loaddata data.json
fi

# Optional super admin bootstrap + ownership consolidation.
# Uses env vars only (no hardcoded credentials):
# PLATFORM_SUPERADMIN_USERNAME, PLATFORM_SUPERADMIN_EMAIL, PLATFORM_SUPERADMIN_PASSWORD
if [[ -n "${PLATFORM_SUPERADMIN_USERNAME}" && -n "${PLATFORM_SUPERADMIN_EMAIL}" && -n "${PLATFORM_SUPERADMIN_PASSWORD}" ]]; then
  python manage.py consolidate_opportunities \
    --username "${PLATFORM_SUPERADMIN_USERNAME}" \
    --email "${PLATFORM_SUPERADMIN_EMAIL}" \
    --password "${PLATFORM_SUPERADMIN_PASSWORD}" \
    --create-if-missing \
    --promote-existing \
    --exclusive-superadmin
fi
