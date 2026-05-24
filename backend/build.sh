#!/usr/bin/env bash
# =============================================================================
# Render Build Script — BYN-K Django Backend
#
# IMPORTANT: No database operations here — the build container has no
# network access to PostgreSQL. Migrations run in preDeployCommand instead.
# =============================================================================
set -o errexit

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Collecting static files (no DB needed) ==="
python manage.py collectstatic --no-input

echo "=== Build complete ==="
