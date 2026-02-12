"""
Django management command to fix the org_logo migration conflict.

This command handles the scenario where the org_logo column already exists
in the database but the corresponding migration has not been recorded.
"""

from django.core.management.base import BaseCommand
from django.db import connection
from django.db.migrations.recorder import MigrationRecorder


class Command(BaseCommand):
    help = (
        "Fix migration state for org_logo field when column already exists. "
        "This handles duplicate migration scenarios safely."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Preview changes without applying them.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]

        # Check if org_logo column exists in listings_job table
        column_exists = self._check_column_exists()

        if column_exists:
            self.stdout.write(
                self.style.SUCCESS(
                    "Column 'org_logo' exists in 'listings_job' table."
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    "Column 'org_logo' does NOT exist in 'listings_job' table. "
                    "No fix needed - migrations will add it normally."
                )
            )
            return

        # Check migration state
        recorder = MigrationRecorder(connection)
        applied_migrations = recorder.applied_migrations()

        migration_0008_job_org_logo = ("listings", "0008_job_org_logo")
        migration_0008_add_org_logo = ("listings", "0008_add_org_logo")

        job_org_logo_applied = migration_0008_job_org_logo in applied_migrations
        add_org_logo_applied = migration_0008_add_org_logo in applied_migrations

        self.stdout.write(f"Migration 0008_job_org_logo applied: {job_org_logo_applied}")
        self.stdout.write(f"Migration 0008_add_org_logo applied: {add_org_logo_applied}")

        # If column exists but migrations aren't recorded, we need to fake them
        migrations_to_fake = []

        if not job_org_logo_applied:
            migrations_to_fake.append(migration_0008_job_org_logo)

        if not add_org_logo_applied:
            migrations_to_fake.append(migration_0008_add_org_logo)

        if not migrations_to_fake:
            self.stdout.write(
                self.style.SUCCESS(
                    "All org_logo migrations are already recorded. No fix needed."
                )
            )
            return

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"DRY RUN: Would fake the following migrations: "
                    f"{[m[1] for m in migrations_to_fake]}"
                )
            )
            return

        # Record the migrations as applied (fake them)
        for app_label, migration_name in migrations_to_fake:
            recorder.record_applied(app_label, migration_name)
            self.stdout.write(
                self.style.SUCCESS(
                    f"Recorded migration '{migration_name}' as applied (faked)."
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Migration state fixed. Run 'python manage.py migrate' to continue."
            )
        )

    def _check_column_exists(self):
        """Check if org_logo column exists in listings_job table."""
        with connection.cursor() as cursor:
            vendor = connection.vendor

            if vendor == "sqlite":
                # SQLite uses PRAGMA for table info, returns different format
                cursor.execute("PRAGMA table_info(listings_job);")
                columns = cursor.fetchall()
                return any(col[1] == "org_logo" for col in columns)

            if vendor in ("postgresql", "mysql"):
                # PostgreSQL and MySQL use information_schema
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'listings_job' 
                    AND column_name = 'org_logo';
                """)
                result = cursor.fetchone()
                return result is not None

            # Generic fallback using Django's introspection API
            # Works with any Django-supported database
            try:
                introspection = connection.introspection
                table_description = introspection.get_table_description(
                    cursor, "listings_job"
                )
                return any(col.name == "org_logo" for col in table_description)
            except Exception:
                self.stdout.write(
                    self.style.WARNING(
                        f"Unknown database vendor '{vendor}'. "
                        "Assuming column does not exist."
                    )
                )
                return False
