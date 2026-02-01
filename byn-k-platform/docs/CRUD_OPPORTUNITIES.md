# CRUD Operations Guide for Opportunities

This guide explains how to Create, Read, Update, and Delete (CRUD) opportunities in the BYN-K Platform. The platform uses **Payload CMS** as the content management system, with **PostgreSQL** (hosted on Supabase) as the database.

> **Note**: Supabase is used only as the PostgreSQL database provider. All data operations go through Payload CMS, not directly to Supabase.

## Table of Contents

1. [Understanding the Architecture](#understanding-the-architecture)
2. [CRUD via Payload CMS Admin Panel](#crud-via-payload-cms-admin-panel)
3. [CRUD via Payload REST API](#crud-via-payload-rest-api)
4. [CRUD via GraphQL API](#crud-via-graphql-api)
5. [CRUD via Server-Side Functions](#crud-via-server-side-functions)
6. [Opportunity Data Structure](#opportunity-data-structure)

---

## Understanding the Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Payload CMS   │────▶│   PostgreSQL    │
│   (Next.js)     │     │   (API/Admin)   │     │   (Supabase)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Payload CMS**: Handles all CRUD operations, authentication, and access control
- **PostgreSQL (Supabase)**: Stores all data, but is accessed through Payload
- **Next.js**: Frontend and server components that call Payload functions

---

## CRUD via Payload CMS Admin Panel

The easiest way to manage opportunities is through the Payload Admin Panel.

### Accessing the Admin Panel

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Navigate to: `http://localhost:3000/admin`
3. Log in with admin credentials

### Create an Opportunity

1. Go to **Content Management** → **Opportunities**
2. Click **Create New**
3. Fill in the required fields:
   - **Title**: The opportunity name
   - **Organization**: Select from existing partners
   - **Category**: Jobs, Internships, Scholarships, or Fellowships
   - **Deadline**: Application deadline date
   - **Application Method**: Direct Link or Email
   - **Description**: Rich text or upload document
4. Optional fields:
   - **Location/Region**: Kenya, Uganda, Tanzania, Rwanda, Remote, or Multiple
   - **Accepted Documentation**: Alien Card, CTD, Passport, etc.
   - **Featured**: Show in featured section
   - **Verified**: Indicate admin verification
5. Click **Save** or **Publish**

### Read Opportunities

- View all opportunities in the **Opportunities** list
- Use filters: Category, Status, Verified, Featured
- Click on any opportunity to view details

### Update an Opportunity

1. Click on the opportunity to edit
2. Make changes to any field
3. Click **Save**

### Delete an Opportunity

1. Click on the opportunity
2. Click **Delete** (only available to admins)
3. Confirm deletion

---

## CRUD via Payload REST API

Payload automatically generates REST API endpoints for all collections.

### Base URL
```
http://localhost:3000/api
```

### Authentication

Most write operations require authentication. Get a token by logging in:

```bash
# Login to get token
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your-password"}'
```

Response includes a token to use in subsequent requests.

### Create (POST)

```bash
curl -X POST http://localhost:3000/api/opportunities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Software Developer Intern",
    "organization": 1,
    "category": "internships",
    "deadline": "2025-06-30T23:59:59.000Z",
    "location": "kenya",
    "applicationType": "link",
    "applyLink": "https://example.com/apply",
    "documentation": ["alien_card", "passport"],
    "descriptionType": "text",
    "description": {"root": {"children": [...]}},
    "isActive": true,
    "isVerified": false,
    "isFeatured": false
  }'
```

### Read (GET)

```bash
# Get all opportunities
curl http://localhost:3000/api/opportunities

# Get single opportunity by ID
curl http://localhost:3000/api/opportunities/1

# Filter opportunities
curl "http://localhost:3000/api/opportunities?where[category][equals]=jobs"

# Paginate results
curl "http://localhost:3000/api/opportunities?limit=10&page=1"

# Sort results
curl "http://localhost:3000/api/opportunities?sort=-createdAt"
```

### Update (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/opportunities/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "isFeatured": true
  }'
```

### Delete (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/opportunities/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## CRUD via GraphQL API

Payload also provides a GraphQL API for more flexible queries.

### GraphQL Endpoint
```
POST http://localhost:3000/api/graphql
```

### GraphQL Playground
```
http://localhost:3000/api/graphql-playground
```

### Create Mutation

```graphql
mutation CreateOpportunity($data: mutationOpportunityInput!) {
  createOpportunity(data: $data) {
    id
    title
    category
    deadline
  }
}
```

Variables:
```json
{
  "data": {
    "title": "Data Analyst Position",
    "organization": 1,
    "category": "jobs",
    "deadline": "2025-07-15T23:59:59.000Z",
    "applicationType": "email",
    "applicationEmail": "careers@company.com"
  }
}
```

### Read Query

```graphql
query GetOpportunities {
  Opportunities(limit: 10, sort: "-createdAt") {
    docs {
      id
      title
      category
      deadline
      organization {
        name
      }
      isVerified
      isFeatured
    }
    totalDocs
    hasNextPage
  }
}

# Single opportunity
query GetOpportunity($id: Int!) {
  Opportunity(id: $id) {
    id
    title
    description
    organization {
      name
      website
    }
  }
}
```

### Update Mutation

```graphql
mutation UpdateOpportunity($id: Int!, $data: mutationOpportunityUpdateInput!) {
  updateOpportunity(id: $id, data: $data) {
    id
    title
    isFeatured
  }
}
```

### Delete Mutation

```graphql
mutation DeleteOpportunity($id: Int!) {
  deleteOpportunity(id: $id) {
    id
  }
}
```

---

## CRUD via Server-Side Functions

For server components and API routes, use the functions in `/src/lib/payload.ts`.

### Import the Functions

```typescript
import {
  getOpportunities,
  getLatestOpportunities,
  getOpportunityById,
  getOpportunitiesByCategory,
  getOpportunitiesByPartner,
  getFeaturedOpportunities,
} from '@/lib/payload'
```

### Read Operations

```typescript
// Get all opportunities
const opportunities = await getOpportunities()

// Get latest 5 opportunities
const latest = await getLatestOpportunities(5)

// Get single opportunity
const opportunity = await getOpportunityById(123)

// Get by category
const jobs = await getOpportunitiesByCategory('jobs')

// Get by partner
const partnerOpps = await getOpportunitiesByPartner(1)

// Get featured opportunities
const featured = await getFeaturedOpportunities(5)
```

### Create/Update/Delete Operations

For create, update, and delete operations from server code, use Payload directly:

```typescript
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

// Create
async function createOpportunity(data: OpportunityInput) {
  const payload = await getPayload({ config: configPromise })
  
  const newOpportunity = await payload.create({
    collection: 'opportunities',
    data: {
      title: data.title,
      organization: data.organizationId,
      category: data.category,
      deadline: data.deadline,
      applicationType: data.applicationType,
      applyLink: data.applyLink,
      isActive: true,
    },
  })
  
  return newOpportunity
}

// Update
async function updateOpportunity(id: number, data: Partial<OpportunityInput>) {
  const payload = await getPayload({ config: configPromise })
  
  const updated = await payload.update({
    collection: 'opportunities',
    id,
    data,
  })
  
  return updated
}

// Delete
async function deleteOpportunity(id: number) {
  const payload = await getPayload({ config: configPromise })
  
  await payload.delete({
    collection: 'opportunities',
    id,
  })
}
```

---

## Opportunity Data Structure

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

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| Public | ❌ | ✅ | ❌ | ❌ |
| Authenticated User | ✅ | ✅ | ❌ | ❌ |
| Moderator | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## Tips

1. **Always create partners first** - Opportunities require a partner organization relationship
2. **Use the admin panel for complex edits** - Rich text descriptions are easier to edit in the UI
3. **Test in development** - Use `npm run dev` for hot reloading while developing
4. **Check required fields** - Missing required fields will cause validation errors
5. **Use the GraphQL playground** - Great for testing queries and exploring the schema

---

## Related Files

- Collection Config: `/src/collections/Opportunities.ts`
- Data Functions: `/src/lib/payload.ts`
- API Routes: `/src/app/api/admin/opportunities/`
- Types: `/src/payload-types.ts` (auto-generated)
