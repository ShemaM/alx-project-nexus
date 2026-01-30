# BYN-K Platform

> A dedicated opportunity hub for Banyamulenge refugee youth in Kenya — the flagship implementation of Project Nexus.

[![CI/CD Pipeline](https://github.com/ShemaM/alx-project-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/ShemaM/alx-project-nexus/actions/workflows/ci.yml)

---

## 🌟 About Project Nexus

**Project Nexus** is an initiative to build a scalable, multi-tenant platform for creating community-focused web applications. The goal is to provide a reusable, robust, and customizable foundation that can be rapidly deployed and configured for various communities, each with its unique content and needs.

This core platform, "Nexus," is designed to be a configurable system that different organizations can use as a starting point, saving significant time and resources in development.

---

## 📚 Case Study: The Banyamulenge Youth of Kenya (BYN-K) Platform

This repository is the first implementation of the Project Nexus vision—a dedicated platform for the Banyamulenge Youth of Kenya (BYN-K). It serves as a central hub for this community, offering:

### Core Features

| Feature | Description |
|---------|-------------|
| 🎯 **Opportunities** | Curated jobs, scholarships, internships, and fellowships with documentation requirements |
| 🤝 **Partners** | Directory of organizations supporting the BYN-K community |
| 📖 **Resources** | Guides, tutorials, CV templates, and career advice |
| 📅 **Events** | Workshops, webinars, career fairs, and networking sessions |
| 📢 **Announcements** | Site-wide notifications with scheduling and priority levels |
| 🔖 **Bookmarks** | Save opportunities for later with personal notes |

### User Experience Features

| Feature | Description |
|---------|-------------|
| 🎓 **Site Tour** | Guided onboarding for first-time visitors |
| 🔔 **Notifications** | Toast notifications for user actions |
| ⚡ **Dynamic UI** | Smooth animations and hover effects |
| 📱 **Responsive** | Mobile-first design |
| ♿ **Accessible** | WCAG-compliant focus states and ARIA support |

### Admin Features

| Feature | Description |
|---------|-------------|
| ✅ **Verification** | Admin-verified opportunities badge |
| ⭐ **Featured Content** | Highlight important opportunities and partners |
| 🎛️ **Site Settings** | Global configuration via Payload admin |
| 🚧 **Maintenance Mode** | Quick toggle for site maintenance |
| 📊 **Analytics Ready** | Google Analytics integration support |

---

## 🛠️ Tech Stack & Rationale

The technologies for Project Nexus were chosen to prioritize developer experience, scalability, and maintainability.

### Stack Overview

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, React 19 | Server-side rendering, App Router |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Backend/CMS** | Payload CMS 3.72 | Headless CMS with admin panel |
| **Database** | PostgreSQL | Relational database via Supabase |
| **Testing** | Playwright, Vitest | E2E and integration testing |
| **CI/CD** | GitHub Actions | Automated testing and security scanning |
| **Security** | CodeQL, Dependabot | Static analysis and dependency updates |

### Why Payload CMS?

Payload was chosen as our content management system and application framework for several key reasons:

- **Code-First & TypeScript-Native:** Unlike traditional CMSs, Payload allows us to define our data structures directly in TypeScript code. This provides strong typing from the database to the frontend, reducing errors and improving developer productivity.
- **Extensible & Customizable:** It's built to be a developer-first platform. We can easily extend its core functionality, customize the admin UI with our own React components, and integrate it seamlessly into our Next.js application.
- **Self-Hosted & Scalable:** Being able to self-host gives us full control over our data and infrastructure. It runs as a standard Node.js application, which can be easily containerized and scaled.
- **Powerful Features Out-of-the-Box:** Payload provides a rich feature set, including a flexible field editor, authentication, file uploads, and a robust GraphQL API.

*Alternatives considered: Strapi, Contentful. Payload's deep React integration and code-first approach made it ideal.*

### Why Supabase?

Supabase serves as our backend-as-a-service (BaaS) platform, primarily for its PostgreSQL database:

- **Open Source & PostgreSQL-Based:** Reliable, powerful SQL database with excellent documentation.
- **More than a Database:** Offers authentication, storage, and auto-generated APIs for future growth.
- **Excellent Developer Experience:** Clean dashboard, easy-to-use client libraries.

*Alternatives considered: AWS RDS, PlanetScale. Supabase offers better DX for rapid development.*

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.20.2 or >=20.9.0
- **pnpm**: v9 or v10
- **Docker**: Optional, for local PostgreSQL

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShemaM/alx-project-nexus.git
   cd alx-project-nexus/byn-k-platform
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following in `.env`:
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/db
   PAYLOAD_SECRET=your-secret-key-min-32-chars
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Access the application:**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
   - **GraphQL Playground**: [http://localhost:3000/api/graphql-playground](http://localhost:3000/api/graphql-playground)

### Using Docker for Local Development

```bash
# Start PostgreSQL container
docker-compose up -d

# Update .env
DATABASE_URL=postgresql://payload:payload@localhost:5432/payload

# Run development server
pnpm dev
```

---

## 📁 Project Structure

```
byn-k-platform/
├── src/
│   ├── app/
│   │   ├── (frontend)/       # Public pages (home, opportunities, etc.)
│   │   └── (payload)/        # Payload admin panel and API
│   ├── collections/          # Payload CMS data models
│   │   ├── Announcements.ts  # Site-wide notifications
│   │   ├── Bookmarks.ts      # User saved opportunities
│   │   ├── Events.ts         # Community events
│   │   ├── Media.ts          # File uploads
│   │   ├── Opportunities.ts  # Jobs, scholarships, etc.
│   │   ├── Partners.ts       # Partner organizations
│   │   ├── Resources.ts      # Guides and tutorials
│   │   └── Users.ts          # User accounts with RBAC
│   ├── components/
│   │   ├── cards/            # Card components
│   │   ├── home/             # Homepage sections
│   │   ├── layout/           # Navbar, Footer, Providers
│   │   └── ui/               # Reusable UI (Toast, SiteTour, etc.)
│   ├── contexts/             # React contexts
│   │   ├── NotificationContext.tsx
│   │   └── SiteTourContext.tsx
│   ├── globals/
│   │   └── SiteSettings.ts   # Global site configuration
│   ├── lib/
│   │   └── payload.ts        # Payload utility functions
│   └── payload.config.ts     # Main Payload configuration
├── tests/
│   ├── e2e/                  # Playwright E2E tests
│   └── int/                  # Vitest integration tests
├── public/                   # Static assets
├── docker-compose.yml        # Docker configuration
└── package.json
```

---

## 📊 Data Model

### Collections

| Collection | Purpose | Access |
|------------|---------|--------|
| **Users** | User accounts with roles (admin, moderator, user) | Self + Admin |
| **Opportunities** | Jobs, scholarships, internships, fellowships | Public read |
| **Partners** | Organizations offering opportunities | Public read |
| **Resources** | Guides, tutorials, templates | Public (published) |
| **Events** | Workshops, webinars, career fairs | Public (published) |
| **Announcements** | Site-wide notifications | Public (active) |
| **Bookmarks** | User's saved opportunities | Owner only |
| **Media** | Images and documents | Public read |

### Globals

| Global | Purpose |
|--------|---------|
| **SiteSettings** | Site name, contact info, social links, feature flags |

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run E2E tests (Playwright)
pnpm test:e2e

# Run integration tests (Vitest)
pnpm test:int

# Lint code
pnpm lint
```

---

## 🔒 Security Features

This project implements SSDLC (Secure Software Development Lifecycle) practices:

- **Authentication**: JWT-based with role-based access control (RBAC)
- **Authorization**: Field-level and collection-level access control
- **Input Validation**: Server-side validation on all fields
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting**: Login attempt throttling (5 attempts, 15-min lockout)
- **CI/CD Security**: CodeQL analysis, npm audit, Dependabot

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ShemaM/alx-project-nexus&root-directory=byn-k-platform&env=DATABASE_URL,PAYLOAD_SECRET&envDescription=Database%20connection%20and%20Payload%20secret%20key)

#### One-Click Deploy

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Configure environment variables:
   - `DATABASE_URL` - Your Supabase PostgreSQL connection string
   - `PAYLOAD_SECRET` - A strong secret key (minimum 32 characters)
4. Deploy!

#### Manual Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from the platform directory
cd byn-k-platform
vercel

# For production deployment
vercel --prod
```

#### Environment Variables (Production)

Set these in your Vercel project dashboard under **Settings > Environment Variables**:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) | ✅ |
| `PAYLOAD_SECRET` | Secret key for Payload CMS (min 32 chars) | ✅ |
| `NEXT_PUBLIC_SERVER_URL` | Your production URL (e.g., `https://yourdomain.vercel.app`) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ❌ |

### Alternative: Docker Deployment

```bash
# Build the image
docker build -t byn-k-platform .

# Run the container
docker run -p 3000:3000 --env-file .env byn-k-platform
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](../CONTRIBUTING.md) before submitting:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow secure coding practices
4. Write tests for new functionality
5. Commit changes (`git commit -m 'feat: add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Banyamulenge Youth of Kenya** - For inspiring this platform
- **ALX Software Engineering** - For the learning opportunity
- **Payload CMS** - For the excellent headless CMS
- **Supabase** - For the developer-friendly database platform
