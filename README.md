# Project Nexus

> A scalable, multi-tenant platform for building community-focused web applications.

[![CI/CD Pipeline](https://github.com/ShemaM/alx-project-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/ShemaM/alx-project-nexus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ShemaM/alx-project-nexus&root-directory=byn-k-platform)

## 🌟 Overview

Project Nexus is an initiative to build a scalable, multi-tenant platform for creating community-focused web applications. The goal is to provide a reusable, robust, and customizable foundation that can be rapidly deployed and configured for various communities, each with its unique content and needs.

## 📚 Case Study: BYN-K Platform

The **Banyamulenge Youth of Kenya (BYN-K) Platform** is the flagship implementation of Project Nexus—a dedicated opportunity hub for refugee youth in Kenya.

### Features

- 🎯 **Opportunity Listings** - Verified jobs, scholarships, internships, and fellowships
- 🤝 **Partner Directory** - Organizations supporting the community
- 📖 **Resource Hub** - Guides, tutorials, and career resources
- 📅 **Community Events** - Workshops, webinars, and networking opportunities
- 📢 **Announcements** - Site-wide notifications and updates
- 🔖 **Bookmarks** - Save opportunities for later
- 🎓 **Onboarding Tour** - First-time visitor guidance
- 🔔 **Notifications** - Real-time toast notifications

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS |
| **Backend/CMS** | Payload CMS 3.x |
| **Database** | PostgreSQL via Supabase |
| **Testing** | Playwright (E2E), Vitest (Integration) |
| **CI/CD** | GitHub Actions with CodeQL security scanning |
| **Deployment** | Vercel |

## 🚀 Quick Start

```bash
# Clone and navigate to the platform
git clone https://github.com/ShemaM/alx-project-nexus.git
cd alx-project-nexus/byn-k-platform

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL and PAYLOAD_SECRET

# Start development server
pnpm dev
```

Visit:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## ☁️ Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ShemaM/alx-project-nexus&root-directory=byn-k-platform&env=DATABASE_URL,PAYLOAD_SECRET&envDescription=Database%20connection%20and%20Payload%20secret%20key)

### Manual Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to platform: `cd byn-k-platform`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your Supabase PostgreSQL connection string
   - `PAYLOAD_SECRET` - A strong secret key (min 32 characters)

## 📁 Repository Structure

```
alx-project-nexus/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── dependabot.yml      # Dependency updates
├── byn-k-platform/         # Main application
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── collections/   # Payload CMS schemas
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── globals/       # Payload globals
│   │   └── lib/           # Utilities
│   ├── tests/             # Test suites
│   ├── vercel.json        # Vercel configuration
│   └── public/            # Static assets
├── SECURITY.md            # Security policy
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md              # This file
```

## 🔒 Security

This project follows **Secure Software Development Lifecycle (SSDLC)** practices:

- ✅ CodeQL static analysis
- ✅ Automated dependency scanning (Dependabot)
- ✅ Security headers (HSTS, X-Frame-Options, CSP-ready)
- ✅ Role-based access control
- ✅ Input validation and sanitization

See [SECURITY.md](./SECURITY.md) for vulnerability disclosure policy.

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for:

- Secure coding practices
- Pull request process
- Code style requirements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./byn-k-platform/LICENSE) file for details.

## 📖 Documentation

For detailed documentation, see the [BYN-K Platform README](./byn-k-platform/README.md).

