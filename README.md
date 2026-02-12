# Opportunities for Banyamulenge Youth in Kenya (BYN-K Platform)

> **ProDev Frontend Engineering Capstone Project**

## Mission

The BYN-K Platform is a community-driven platform designed to **empower the Banyamulenge Youth in Kenya** by bridging the gap between opportunities—including jobs, scholarships, and educational resources—and the community members who need them most.

Our goal is to create an accessible, modern digital hub where young Banyamulenge can discover career opportunities, share resources, and build connections that will help them succeed in their professional journeys.

---

## Tech Stack

| Layer    | Technology                | Version   |
| -------- | ------------------------- | --------- |
| Frontend | Next.js                   | 15.4.10   |
| Frontend | React                     | 19.2.1    |
| Frontend | TypeScript                | 5.9.3     |
| Frontend | Tailwind CSS              | 4.1.18    |
| Backend  | Django                    | 5.2.10    |
| Backend  | Django REST Framework     | 3.16.1    |
| Database | PostgreSQL                | Latest    |
| Testing  | Playwright / Vitest       | 1.56.1 / 3.2.3 |

---

## Architecture

This project follows a **Monorepo** structure with clear separation of concerns:

```
alx-project-nexus/
├── byn-k-platform/          # Next.js Frontend Application
│   ├── src/                 # React components, pages, and utilities
│   ├── public/              # Static assets
│   ├── tests/               # Frontend tests (Playwright, Vitest)
│   └── package.json         # Frontend dependencies (pnpm)
│
├── backend/                 # Django REST Framework Backend
│   ├── listings/            # Opportunity listings API
│   ├── users/               # User management
│   ├── config/              # Django configuration
│   ├── requirements.txt     # Python dependencies
│   └── manage.py            # Django management script
│
├── README.md                # Project documentation
├── CONTRIBUTING.md          # Contribution guidelines
└── SECURITY.md              # Security policy
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.10.0
- **pnpm** >= 9.x
- **Python** >= 3.10
- **PostgreSQL** (for production) or SQLite (for development)

### Frontend Setup

```bash
# Navigate to the frontend directory
cd byn-k-platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`.

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`.

---

## Features

### 🎯 Opportunity Listings

Browse and search for curated opportunities including:
- Job openings from verified employers
- Scholarship programs and educational grants
- Internship and mentorship programs
- Community events and networking opportunities

### 🌟 Featured Hero

A dynamic hero section showcasing:
- Highlighted opportunities that need immediate attention
- Success stories from community members
- Important announcements and updates

### 🔖 User Bookmarks

Personalized experience for registered users:
- Save opportunities for later review
- Track application statuses
- Receive notifications for bookmarked items
- Organize opportunities by category

---

## Scripts Reference

### Frontend (byn-k-platform)

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start development server             |
| `pnpm build`     | Build for production                 |
| `pnpm start`     | Start production server              |
| `pnpm lint`      | Run ESLint                           |
| `pnpm test`      | Run all tests                        |
| `pnpm test:int`  | Run integration tests (Vitest)       |
| `pnpm test:e2e`  | Run end-to-end tests (Playwright)    |

### Backend

| Command                          | Description                  |
| -------------------------------- | ---------------------------- |
| `python manage.py runserver`     | Start development server     |
| `python manage.py migrate`       | Apply database migrations    |
| `python manage.py createsuperuser` | Create admin user          |
| `python manage.py test`          | Run tests                    |

---

## License

This project is licensed under the MIT License. See the [LICENSE](./byn-k-platform/LICENSE) file for details.

---

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get involved.

## Security

For security concerns, please review our [SECURITY.md](./SECURITY.md) policy.

---

<p align="center">
  <strong>Built with ❤️ for the Banyamulenge Youth in Kenya community</strong>
</p>
