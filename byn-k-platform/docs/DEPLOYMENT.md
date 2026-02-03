# Deployment Guide: Split-Stack Monorepo

This guide documents the deployment configuration for the BYN-K Platform split-stack monorepo:

- **Frontend**: Next.js app in `/byn-k-platform/` → **Vercel**
- **Backend**: App in `/backend/` → **Render**
- **Database**: **Supabase** (PostgreSQL)

---

## Table of Contents

1. [Backend CORS Configuration](#1-backend-cors-configuration)
2. [Platform Dashboard Settings](#2-platform-dashboard-settings)
3. [Handling Encoded Characters in Connection Strings](#3-handling-encoded-characters-in-connection-strings)
4. [Environment Variable Security Mapping](#4-environment-variable-security-mapping)

---

## 1. Backend CORS Configuration

To allow cross-origin requests from your Vercel-deployed frontend to the Render-deployed backend, configure CORS appropriately.

### Node.js/Express Example

If using Node.js/Express for the backend:

```javascript
const cors = require('cors');
const express = require('express');
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL, // e.g., https://your-app.vercel.app
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Django Example

If using Django for the backend, configure `django-cors-headers` in `settings.py`:

```python
import os

CORS_ALLOWED_ORIGINS = [
    os.environ.get('FRONTEND_URL', 'http://localhost:3000'),
]

CORS_ALLOW_CREDENTIALS = True
```

### Key Points

- The `FRONTEND_URL` environment variable must be set in your Render dashboard
- Set it to your production Vercel domain (e.g., `https://your-app.vercel.app`)
- Never use wildcards (`*`) in production for security reasons

---

## 2. Platform Dashboard Settings

### Vercel (Frontend)

| Setting | Value |
| --- | --- |
| **Root Directory** | `byn-k-platform` |
| **Build Command** | `npm run build` (or `pnpm build`) |
| **Install Command** | `npm install` (or `pnpm install`) |
| **Framework Preset** | Next.js (auto-detected) |

### Render (Backend)

#### For Node.js/Express Backend

| Setting | Value |
| --- | --- |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` (or your start script) |
| **Environment** | Node |

#### For Django Backend (Current Implementation)

| Setting | Value |
| --- | --- |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn config.wsgi:application` |
| **Environment** | Python 3 |

### Important Notes

- Ensure the **Root Directory** is correctly set so each platform only builds its respective folder
- Both platforms will detect a monorepo structure and require explicit root directory configuration
- For the frontend, `vercel.json` can also specify build configuration (already present in this repo)

---

## 3. Handling Encoded Characters in Connection Strings

### Critical Note

When entering your Supabase `DATABASE_URL` into the Render dashboard:

- **Do NOT** use double quotes around the string
- Render treats the input as a **raw string literal**
- Your URL encoding (`%25` for `%`, `%40` for `@`) is already correct for the `pg` driver to parse

### Common Encoding Reference

| Character | Encoded Value |
| --- | --- |
| `@` | `%40` |
| `%` | `%25` |
| `/` | `%2F` |
| `:` | `%3A` |
| `#` | `%23` |
| `?` | `%3F` |

### Example

```
# Correct format (raw, no quotes)
postgresql://user:p%40ssw%25rd@host:5432/database

# INCORRECT (do not add quotes in Render)
"postgresql://user:p%40ssw%25rd@host:5432/database"
```

---

## 4. Environment Variable Security Mapping

### Frontend (Vercel) - Public Variables

These variables are **bundled into the JavaScript** sent to the browser. They must use the `NEXT_PUBLIC_` prefix.

| Variable | Type | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Public | Backend API endpoint URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous/public key |

> ⚠️ **Security Warning**: Never put `DATABASE_URL`, `SERVICE_ROLE_KEY`, or any secret keys in `NEXT_PUBLIC_` variables!

### Backend (Render) - Secret/Private Variables

These variables are strictly server-side. Render encrypts them at rest.

| Variable | Type | Description |
| --- | --- | --- |
| `DATABASE_URL` | Secret | Supabase pooled connection string |
| `DIRECT_URL` | Secret | Supabase direct connection string |
| `FRONTEND_URL` | Secret | Vercel frontend URL (for CORS) |
| `PORT` | Secret | Server port (usually set by Render) |

### Variable Security Summary

| Variable | Platform | Visibility | Reason |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Vercel | Public | Needed in browser for API calls |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Public | Needed in browser for Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Public | Safe for browser (row-level security) |
| `DATABASE_URL` | Render | Secret | Contains credentials |
| `DIRECT_URL` | Render | Secret | Contains credentials |
| `FRONTEND_URL` | Render | Secret | Server-side configuration |
| `PORT` | Render | Secret | Server-side configuration |

---

## Quick Reference Checklist

### Before Deploying

- [ ] Set up Supabase project and copy connection strings
- [ ] Verify `DATABASE_URL` encoding is correct (no quotes needed)
- [ ] Configure environment variables in both platforms

### Vercel Deployment

- [ ] Set Root Directory to `byn-k-platform`
- [ ] Configure `NEXT_PUBLIC_*` environment variables
- [ ] Verify build completes successfully

### Render Deployment

- [ ] Set Root Directory to `backend`
- [ ] Set Build Command to `npm install`
- [ ] Set Start Command to your server entry point
- [ ] Configure all secret environment variables
- [ ] Set `FRONTEND_URL` to your Vercel production URL

### Post-Deployment

- [ ] Test CORS by making API calls from frontend
- [ ] Verify database connections
- [ ] Check browser console for any CORS errors

---

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Verify `FRONTEND_URL` is set correctly in Render (include `https://`)
2. Ensure no trailing slash in the URL
3. Restart the Render service after environment variable changes

### Database Connection Errors

1. Verify the connection string encoding
2. Check that you're using the pooled connection URL for `DATABASE_URL`
3. Ensure your IP is allowed in Supabase (if IP restrictions are enabled)

### Build Failures

1. Check that the Root Directory is set correctly
2. Verify all required environment variables are present
3. Review build logs for specific error messages
