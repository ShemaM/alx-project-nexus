# BYN-K Platform - Django Backend

This is the Django REST Framework backend for the BYN-K Platform. It provides a robust API for managing opportunities, user authentication, and other platform data.

## Overview

**Operational Mandate**: We do NOT process applications. We curate opportunities and redirect users to external portals (Forms, Emails, Websites).

## Features

### Phase 2: The Gateway Backend
- Custom User Model with legacy `is_admin` flag and superadmin (`is_superuser`) access control
- Job Listings model with:
  - Required documents (for advanced filtering)
  - Application types (External Link, Email, PDF Brochure)
  - Preparation checklist
  - WhatsApp verification badge

### Phase 3: Advanced Filtering & Security
- Django-filter for queries like `?docs=alien_card&category=scholarship`
- CORS configuration for localhost:3000
- Protected media for PDF brochures
- Mandatory disclaimer in all API responses

### Phase 4: Admin "WhatsApp-to-Web" Efficiency
- Custom admin form with "Raw Data" text area
- Click tracking analytics

## Setup

### Prerequisites
- Python 3.10+
- pip

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create environment file:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create super admin user:
```bash
python manage.py createsuperuser
```

Optional consolidation command (move all opportunities to one super admin):
```bash
python manage.py consolidate_opportunities --username <superadmin_username> --promote-existing --exclusive-superadmin
```

6. Run development server:
```bash
python manage.py runserver
```

## API Endpoints

### Jobs
- `GET /api/jobs/` - List all active jobs (with filtering)
- `GET /api/jobs/{id}/` - Get job details
- `GET /api/jobs/featured/` - Get featured jobs

### Filtering
- `?docs=alien_card` - Filter by required documents
- `?category=scholarship` - Filter by category
- `?location=kenya` - Filter by location
- `?is_verified=true` - Filter by verification status
- `?search=office` - Search in title/organization

### Click Tracking
- `POST /api/track-click/` - Track user clicks

### Auth
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Get current user

### Admin
- `GET /api/analytics/` - Analytics overview (admin only)
- `GET /api/jobs/{id}/brochure/` - Protected brochure download

## Environment Variables

```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Platform Disclaimer

Every API response includes this mandatory disclaimer:

> DISCLAIMER: BYN-K Platform is a gateway service that curates and shares opportunities from various sources. We are NOT the hiring entity, scholarship provider, or organization offering these opportunities. We do not process applications. All applications are submitted directly to the respective organizations through their official channels. Please verify all information with the official source before applying.

## Admin Usage

1. Access the admin panel at `/admin/`
2. To add a new job from WhatsApp:
   - Go to Job Listings > Add Job Listing
   - Paste the WhatsApp message in the "Raw Data" field
   - Fill in the structured fields
   - Upload PDF brochure if available
   - Click "Save"

## License

MIT
