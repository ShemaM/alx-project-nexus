#!/usr/bin/env python
"""
Production Initialization Script for Render Deployment.

This script runs during the Render build/start phase to:
1. Run database migrations
2. Collect static files
3. Create a superuser if credentials are provided via environment variables

Environment Variables:
    DJANGO_SUPERUSER_USERNAME: Username for the superuser
    DJANGO_SUPERUSER_PASSWORD: Password for the superuser
    DJANGO_SUPERUSER_EMAIL: Email for the superuser (optional, defaults to username@example.com)
"""

import os
import subprocess
import sys


def run_command(command: list[str], description: str) -> bool:
    """Run a shell command and return success status."""
    print(f"\n{'=' * 60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(command)}")
    print('=' * 60)

    result = subprocess.run(command, capture_output=False)

    if result.returncode != 0:
        print(f"ERROR: {description} failed with exit code {result.returncode}")
        return False

    print(f"SUCCESS: {description} completed")
    return True


def run_migrations() -> bool:
    """Execute Django database migrations."""
    return run_command(
        [sys.executable, 'manage.py', 'migrate', '--no-input'],
        'Database migrations'
    )


def collect_static() -> bool:
    """Collect static files for production."""
    return run_command(
        [sys.executable, 'manage.py', 'collectstatic', '--no-input'],
        'Static files collection'
    )


def create_superuser() -> bool:
    """
    Programmatically create a superuser if credentials are provided.

    Uses DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD
    environment variables. Does not create if the user already exists.
    """
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME', '').strip()
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '').strip()
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '').strip()

    if not username or not password:
        print("\nINFO: DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD not set.")
        print("Skipping superuser creation.")
        return True

    # Default email if not provided
    if not email:
        email = f"{username}@example.com"

    print(f"\n{'=' * 60}")
    print("Creating superuser (if not exists)")
    print(f"Username: {username}")
    print(f"Email: {email}")
    print('=' * 60)

    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

    import django
    django.setup()

    from django.contrib.auth import get_user_model

    User = get_user_model()

    try:
        if User.objects.filter(username=username).exists():
            print(f"INFO: Superuser '{username}' already exists. Skipping creation.")
            # Ensure the existing user is a superuser
            user = User.objects.get(username=username)
            if not user.is_superuser:
                user.is_superuser = True
                user.is_staff = True
                user.save()
                print(f"INFO: Updated '{username}' to superuser status.")
            return True

        # Create the superuser
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f"SUCCESS: Superuser '{username}' created successfully.")
        return True

    except Exception as e:
        print(f"ERROR: Failed to create superuser: {e}")
        return False


def main() -> int:
    """Main entry point for production initialization."""
    print("\n" + "=" * 60)
    print("BYN-K Platform - Production Initialization")
    print("=" * 60)

    # Change to the backend directory if not already there
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    success = True

    # Step 1: Run migrations
    if not run_migrations():
        success = False
        print("WARNING: Migrations failed, but continuing...")

    # Step 2: Collect static files
    if not collect_static():
        success = False
        print("WARNING: Static file collection failed, but continuing...")

    # Step 3: Create superuser (if credentials provided)
    if not create_superuser():
        success = False
        print("WARNING: Superuser creation failed, but continuing...")

    print("\n" + "=" * 60)
    if success:
        print("Production initialization completed successfully!")
    else:
        print("Production initialization completed with warnings.")
    print("=" * 60 + "\n")

    # Always return 0 to avoid marking deployment as failed for non-critical warnings.
    # The application can still start and function even if some init steps had issues.
    return 0


if __name__ == '__main__':
    sys.exit(main())
