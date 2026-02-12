from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from listings.models import Job


class Command(BaseCommand):
    help = (
        "Consolidate all opportunity ownership under a single super admin "
        "account without hardcoded credentials."
    )

    def add_arguments(self, parser):
        parser.add_argument("--username", type=str, help="Target super admin username.")
        parser.add_argument("--email", type=str, help="Target super admin email.")
        parser.add_argument(
            "--create-if-missing",
            action="store_true",
            help="Create the target user as a super admin if it does not exist.",
        )
        parser.add_argument(
            "--promote-existing",
            action="store_true",
            help="Promote an existing non-superuser target account to super admin.",
        )
        parser.add_argument(
            "--password",
            type=str,
            help="Optional password to set on the target account.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Preview how many opportunities would be reassigned.",
        )
        parser.add_argument(
            "--exclusive-superadmin",
            action="store_true",
            help=(
                "Revoke platform-management privileges from all other users by "
                "removing staff/superuser flags (and legacy is_admin when present)."
            ),
        )

    @transaction.atomic
    def handle(self, *args, **options):
        username = (options.get("username") or "").strip()
        email = (options.get("email") or "").strip()
        create_if_missing = options["create_if_missing"]
        promote_existing = options["promote_existing"]
        password = options.get("password")
        dry_run = options["dry_run"]
        exclusive_superadmin = options["exclusive_superadmin"]

        if not username and not email:
            raise CommandError("Provide at least one of --username or --email.")

        User = get_user_model()
        user = None

        if username:
            user = User.objects.filter(username=username).first()
        if not user and email:
            user = User.objects.filter(email__iexact=email).first()

        if dry_run:
            if not user and not create_if_missing:
                raise CommandError(
                    "Target user not found. Use --create-if-missing or provide a valid account."
                )
            if not user and (not username or not email):
                raise CommandError(
                    "Creating a target super admin requires both --username and --email."
                )
            if user and (not user.is_superuser) and not promote_existing:
                raise CommandError(
                    "Target user exists but is not a super admin. "
                    "Use --promote-existing to promote this account."
                )

            total_to_move = Job.objects.count() if user is None else Job.objects.exclude(created_by=user).count()
            self.stdout.write(
                self.style.WARNING(
                    "Dry run: "
                    f"{total_to_move} opportunities would be reassigned to "
                    f"'{username or email}'."
                )
            )

            if not user and create_if_missing:
                self.stdout.write(
                    self.style.WARNING(
                        f"Dry run: user '{username}' would be created as super admin."
                    )
                )
            elif user and (not user.is_superuser) and promote_existing:
                self.stdout.write(
                    self.style.WARNING(
                        f"Dry run: '{user.username}' would be promoted to super admin."
                    )
                )

            if password:
                self.stdout.write(
                    self.style.WARNING(
                        "Dry run: target user password would be updated."
                    )
                )

            if exclusive_superadmin:
                other_users = User.objects.exclude(pk=user.pk) if user else User.objects.all()
                demoted_superusers = other_users.filter(is_superuser=True).count()
                demoted_staff = other_users.filter(is_staff=True).count()
                legacy_admin_count = (
                    other_users.filter(is_admin=True).count()
                    if hasattr(User, "is_admin")
                    else 0
                )
                self.stdout.write(
                    self.style.WARNING(
                        "Dry run: exclusive mode would demote "
                        f"{demoted_superusers} superusers, {demoted_staff} staff users, "
                        f"and clear legacy is_admin on {legacy_admin_count} users."
                    )
                )
            return

        if not user:
            if not create_if_missing:
                raise CommandError(
                    "Target user not found. Use --create-if-missing or provide a valid account."
                )
            if not username or not email:
                raise CommandError(
                    "Creating a target super admin requires both --username and --email."
                )
            if not password:
                raise CommandError(
                    "Creating a target super admin requires --password."
                )
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
            )
            self.stdout.write(self.style.SUCCESS(f"Created super admin '{user.username}'."))

        if not user.is_superuser:
            if not promote_existing:
                raise CommandError(
                    "Target user exists but is not a super admin. "
                    "Use --promote-existing to promote this account."
                )
            user.is_staff = True
            user.is_superuser = True
            user.save(update_fields=["is_staff", "is_superuser"])
            self.stdout.write(
                self.style.WARNING(f"Promoted '{user.username}' to super admin.")
            )

        if password:
            user.set_password(password)
            user.save(update_fields=["password"])
            self.stdout.write(self.style.SUCCESS(f"Updated password for '{user.username}'."))

        queryset = Job.objects.exclude(created_by=user)
        total_to_move = queryset.count()

        moved = queryset.update(created_by=user)
        self.stdout.write(
            self.style.SUCCESS(
                f"Reassigned {moved} opportunities to super admin '{user.username}'."
            )
        )

        if exclusive_superadmin:
            other_users = User.objects.exclude(pk=user.pk)
            demoted_superusers = other_users.filter(is_superuser=True).count()
            demoted_staff = other_users.filter(is_staff=True).count()

            update_values = {"is_superuser": False, "is_staff": False}
            if hasattr(User, "is_admin"):
                update_values["is_admin"] = False

            updated_users = other_users.update(**update_values)
            self.stdout.write(
                self.style.SUCCESS(
                    "Exclusive super admin mode applied: "
                    f"{updated_users} users updated "
                    f"(superusers demoted: {demoted_superusers}, staff demoted: {demoted_staff})."
                )
            )
