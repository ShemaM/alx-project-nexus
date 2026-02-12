# Django Migration Fix: org_logo Column Already Exists

## Problem Summary

**Error:** `ProgrammingError: column "org_logo" of relation "listings_job" already exists`

**Root Cause:** Two parallel development branches created duplicate migrations adding the same `org_logo` field:
- `0008_add_org_logo.py` (from Branch A)
- `0008_job_org_logo.py` (from Branch B)

When these branches were merged, Django's merge migration (`0009_merge_...`) was created, but both migrations tried to add the same column to `listings_job`.

## Current Fix Applied

The `0008_add_org_logo.py` migration has been **emptied** (operations = []) to prevent duplicate column creation. The actual field addition is handled solely by `0008_job_org_logo.py`.

---

## Remediation Plans

### Plan A: Fake Migration to Align State (Recommended for Production)

If the `org_logo` column **already exists** in your PostgreSQL database (added by a previous partial migration), fake the problematic migration:

```bash
# Backup your database first!
pg_dump -h YOUR_HOST -U YOUR_USER -d YOUR_DB -f backup_$(date +%Y%m%d_%H%M%S).sql

# Check current migration state
python manage.py showmigrations listings

# If 0008_job_org_logo is not applied but org_logo column exists:
python manage.py migrate listings 0008_job_org_logo --fake

# If 0008_add_org_logo is not applied:
python manage.py migrate listings 0008_add_org_logo --fake

# Continue with remaining migrations
python manage.py migrate
```

**When to use:** The column exists in DB but Django doesn't know about it yet.

---

### Plan B: Remove Duplicate AddField (Already Applied)

This has been completed in the repository:
- `0008_add_org_logo.py` now has `operations = []`
- Only `0008_job_org_logo.py` actually adds the field

**For fresh installations:** Simply run `python manage.py migrate` normally.

---

### Plan C: Synchronize DB by Reverting Column (Development Only)

**⚠️ WARNING:** This will cause data loss if the `org_logo` column contains data.

```bash
# Backup first!
pg_dump -h YOUR_HOST -U YOUR_USER -d YOUR_DB -f backup_$(date +%Y%m%d_%H%M%S).sql

# Connect to PostgreSQL and drop the column
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB

-- Check if column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'listings_job' AND column_name = 'org_logo';

-- Drop the column (DANGEROUS - DATA LOSS)
ALTER TABLE listings_job DROP COLUMN IF EXISTS org_logo;

-- Exit psql
\q

# Reset the migration state (mark as not applied)
python manage.py migrate listings 0007_partner --fake

# Now run migrations fresh
python manage.py migrate
```

**When to use:** Development only, when you don't care about existing data.

---

### Plan D: Rebuild Migrations (Clean Slate - Development Only)

**⚠️ WARNING:** This is a drastic option that should only be used in development or when you can recreate all data.

```bash
# Backup everything
pg_dump -h YOUR_HOST -U YOUR_USER -d YOUR_DB -f full_backup.sql
cp -r backend/listings/migrations listings_migrations_backup

# Option 1: Squash migrations (preserve data)
python manage.py squashmigrations listings 0001 0010

# Option 2: Reset migrations completely (DESTRUCTIVE)
# Delete all migration files except __init__.py
rm backend/listings/migrations/0*.py

# Regenerate migrations from current models
python manage.py makemigrations listings

# Fake apply to match existing schema
python manage.py migrate listings --fake-initial
```

**When to use:** Only in development or when starting fresh.

---

## Validation Steps

After applying any fix, run these validation commands:

```bash
# 1. Check Django system
python manage.py check

# 2. Verify no pending migrations
python manage.py makemigrations --check --dry-run
# Should output: "No changes detected" (exit code 0)

# 3. Show migration status
python manage.py showmigrations listings
# All migrations should show [X] (applied)

# 4. Verify org_logo field exists correctly
python manage.py shell -c "
from listings.models import Job
field = Job._meta.get_field('org_logo')
print(f'Field exists: {field.name}')
print(f'Null allowed: {field.null}')
print(f'Blank allowed: {field.blank}')
print(f'Upload to: {field.upload_to}')
"
# Expected output:
# Field exists: org_logo
# Null allowed: True
# Blank allowed: True
# Upload to: logos/%Y/%m/

# 5. Verify column in database (PostgreSQL)
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB -c "
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'listings_job' AND column_name = 'org_logo';
"
# Expected: org_logo | character varying | YES

# 6. Test creating a job (data integrity check)
python manage.py shell -c "
from listings.models import Job
job = Job.objects.create(
    title='Test Job',
    organization_name='Test Org',
)
print(f'Created job ID: {job.id}')
print(f'org_logo value: {job.org_logo}')
job.delete()
print('Cleanup complete')
"
```

---

## Production Deployment Checklist

1. **Before deployment:**
   - [ ] Backup database: `pg_dump -h HOST -U USER -d DB -f backup.sql`
   - [ ] Check current migration state: `python manage.py showmigrations listings`
   - [ ] Identify which migrations are applied

2. **During deployment:**
   - [ ] Pull latest code with the fixed migration
   - [ ] Apply Plan A (fake) if column exists
   - [ ] Run `python manage.py migrate`

3. **After deployment:**
   - [ ] Run validation steps above
   - [ ] Test application functionality
   - [ ] Monitor logs for any database errors

---

## CI/CD Integration

The CI workflow validates migrations with:

```yaml
- name: Check for missing migrations
  run: python manage.py makemigrations --check --dry-run
```

This ensures all model changes have corresponding migrations and no duplicate operations exist.

---

## Related Files

- `backend/listings/migrations/0008_add_org_logo.py` - Emptied (no operations)
- `backend/listings/migrations/0008_job_org_logo.py` - Contains actual AddField
- `backend/listings/migrations/0009_merge_0008_add_org_logo_0008_job_org_logo.py` - Merge migration
- `backend/listings/models.py` - Job model with org_logo field
