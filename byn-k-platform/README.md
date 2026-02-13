# Opportunities for Banyamulenge Youth in Kenya (BYN-K Platform)

> A dedicated opportunity hub for Banyamulenge refugee youth in Kenya.

[![CI/CD Pipeline](https://github.com/ShemaM/alx-project-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/ShemaM/alx-project-nexus/actions/workflows/ci.yml)

---

## 🌟 About This Platform

**Opportunities for Banyamulenge Youth in Kenya** is a community-driven platform designed to connect Banyamulenge refugee youth with verified opportunities including jobs, scholarships, internships, and fellowships. The platform serves as a central hub for discovering career opportunities and building connections.

---

## 📚 The Banyamulenge Youth of Kenya (BYN-K) Platform

This platform is a dedicated hub for the Banyamulenge Youth of Kenya (BYN-K) community, offering:

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
| 🎛️ **Site Settings** | Global configuration |
| 🚧 **Maintenance Mode** | Quick toggle for site maintenance |
| 📊 **Analytics Ready** | Google Analytics integration support |

---

## 🛠️ Tech Stack & Rationale

The technologies for this platform were chosen to prioritize developer experience, scalability, and maintainability.

### Stack Overview

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, React 19 | Server-side rendering, App Router |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Backend** | Django 5, Django REST Framework | Robust API for data management |
| **Database** | PostgreSQL | Relational database |
| **Testing** | Playwright, Vitest | E2E and integration testing |
| **CI/CD** | GitHub Actions | Automated testing and security scanning |
| **Security** | CodeQL, Dependabot | Static analysis and dependency updates |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.20.2 or >=20.9.0
- **pnpm**: v9 or v10
- **Python**: 3.x
- **pip**: Python package installer

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShemaM/alx-project-nexus.git
   cd alx-project-nexus/byn-k-platform
   ```

2. **Install frontend dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up frontend environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following in `.env`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/  # Your Django backend API URL
   ```

4. **Start frontend development server:**
   ```bash
   pnpm dev
   ```

5. **Access the frontend application:**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)

### Backend Setup (Separate Project)

Please refer to the `backend/README.md` for instructions on setting up and running the Django backend. Ensure the backend is running and accessible at the `NEXT_PUBLIC_API_URL` specified in your frontend `.env` file.

---

## 📁 Project Structure

```
byn-k-platform/
├── src/
│   ├── app/
│   │   ├── (frontend)/       # Public pages (home, opportunities, etc.)
│   │   └── api/              # Frontend API routes (e.g., for data fetching from external API)
│   ├── components/
│   │   ├── cards/            # Card components
│   │   ├── home/             # Homepage sections
│   │   ├── layout/           # Navbar, Footer, Providers
│   │   └── ui/               # Reusable UI (Toast, SiteTour, etc.)
│   ├── contexts/             # React contexts
│   │   ├── NotificationContext.tsx
│   │   └── SiteTourContext.tsx
│   ├── lib/
│   │   └── api.ts            # Frontend API utility functions
│   └── types/                # TypeScript type definitions
├── tests/
│   ├── e2e/                  # Playwright E2E tests
│   └── int/                  # Vitest integration tests
├── public/                   # Static assets
└── package.json
```

---

## 📊 Data Model

Data is managed by the Django backend. The frontend consumes data via API calls.

### Key Data Entities (Managed by Backend)

| Entity | Purpose |
|------------|---------|
| **Users** | User accounts with roles (admin, moderator, user) |
| **Opportunities** | Jobs, scholarships, internships, fellowships |
| **Partners** | Organizations offering opportunities |
| **Resources** | Guides, tutorials, templates |
| **Events** | Workshops, webinars, career fairs |
| **Announcements** | Site-wide notifications |
| **Bookmarks** | User's saved opportunities |
| **Media** | Images and documents |

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

- **Frontend Security**: Measures implemented within the Next.js application (e.g., input sanitization, secure client-side storage).
- **Backend Security**: All API authentication, authorization, input validation, and database security are handled by the Django backend.
- **CI/CD Security**: CodeQL analysis, npm audit, Dependabot

---

## 🚀 Deployment

The frontend is deployed independently.

### Deploy to Vercel (Recommended for Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ShemaM/alx-project-nexus&root-directory=byn-k-platform&env=NEXT_PUBLIC_API_URL&envDescription=The%20URL%20of%20your%20deployed%20Django%20backend%20API)

#### One-Click Deploy

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` - The URL of your deployed Django backend API (e.g., `https://your-backend-api.com/api/`)
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
| `NEXT_PUBLIC_API_URL` | The URL of your deployed Django backend API | ✅ |

### Backend Deployment

For deploying the backend, refer to the instructions in the main [README.md](../README.md) file.

### Comprehensive Deployment Guide

For detailed deployment documentation including:
- CORS configuration for cross-origin requests
- Vercel and Render platform settings
- Supabase connection string encoding
- Environment variable security mapping

See the [Deployment Guide](./docs/DEPLOYMENT.md).

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
- **Django & Django REST Framework** - For the robust backend framework
- **Next.js** - For the excellent frontend framework