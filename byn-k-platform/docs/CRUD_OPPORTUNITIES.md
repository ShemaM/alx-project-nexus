# CRUD Operations Guide for Opportunities

This guide explains how to Create, Read, Update, and Delete (CRUD) opportunities in the BYN-K Platform. These operations are handled by a dedicated backend API.

## Table of Contents

1. [Understanding the Architecture](#understanding-the-architecture)
2. [CRUD Operations Overview](#crud-operations-overview)
3. [Opportunity Data Structure](#opportunity-data-structure)
4. [Access Control](#access-control)
5. [Related Files](#related-files)

---

## Understanding the Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │
│   (Next.js)     │     │                 │
└─────────────────┘     └─────────────────┘
```

- **Backend API**: Handles all CRUD operations, authentication, and access control.
- **Next.js**: Frontend and server components interact with the Backend API.

---

## CRUD Operations Overview

CRUD operations are performed by making HTTP requests to the Backend API. The frontend application uses utility functions (e.g., in `src/lib/api.ts`) to interact with these endpoints.

### Read (Fetching Opportunities)

The frontend application typically fetches opportunities using functions available in `src/lib/api.ts`. These functions handle the necessary HTTP requests and data parsing.

Example of client-side fetching (from `src/lib/api.ts` context):
```typescript
// Example: get opportunities with filters
import { getOpportunities } from '@/lib/api';

async function fetchAndDisplayOpportunities() {
  const filters = {
    category: 'jobs',
    location: 'kenya',
  };
  const opportunities = await getOpportunities(filters);
  console.log(opportunities);
}
```
*(Note: Actual API endpoints and request/response structures are defined by the Backend API and consumed by `src/lib/api.ts`)*

### Create, Update, and Delete Operations

These operations are typically performed by authenticated users (e.g., administrators or moderators) via specific API endpoints. The exact methods (POST, PUT/PATCH, DELETE) and required payloads will depend on the backend API's design.

Refer to the backend API documentation for detailed information on these endpoints, authentication requirements, and data formats.

---

## Opportunity Data Structure

The structure of an opportunity object, as managed by the backend API, typically includes:

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | text | Opportunity title |
| `organization` | relationship | Partner organization ID |
| `category` | select | `jobs`, `internships`, `scholarships`, `fellowships` |
| `deadline` | date | Application deadline |
| `applicationType` | select | `link` or `email` |
| `descriptionType` | select | `text` or `document` |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `location` | select | `kenya`, `uganda`, `tanzania`, `rwanda`, `remote`, `multiple` |
| `documentation` | select (multi) | Accepted ID types |
| `applyLink` | text | Application URL (if `applicationType` is `link`) |
| `applicationEmail` | email | Application email (if `applicationType` is `email`) |
| `emailSubjectLine` | text | Suggested email subject |
| `requiredDocuments` | textarea | Documents to attach for email applications |
| `description` | richText | Opportunity details (if `descriptionType` is `text`) |
| `opportunityDocument` | upload | PDF/document (if `descriptionType` is `document`) |
| `isVerified` | checkbox | Admin verified status |
| `isFeatured` | checkbox | Show in featured section |
| `isActive` | checkbox | Active status (default: true) |

### Documentation Types

- `alien_card` - Alien Card
- `ctd` - Convention Travel Document
- `passport` - Passport
- `waiting_slip` - Waiting Slip
- `any_id` - Any ID
- `not_specified` - Not Specified

---

## Access Control

The backend API enforces access control for various user roles:

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| Public | ❌ | ✅ | ❌ | ❌ |
| Authenticated User | ✅ | ✅ | ❌ | ❌ |
| Moderator | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## Related Files

- Frontend API interaction: `src/lib/api.ts`
- Frontend Types: `src/types/index.ts`
- Frontend opportunity pages: `src/app/(frontend)/opportunities/`
- Admin pages for managing opportunities: `src/app/(frontend)/admin/opportunities/`