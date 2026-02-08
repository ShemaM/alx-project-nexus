# Project Nexus

> A platform for the Banyamulenge Youth Kenya (BYN-K) community to find jobs, scholarships, and resources.

[![CI/CD Pipeline](https://github.com/ShemaM/alx-project-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/ShemaM/alx-project-nexus/actions/workflows/ci.yml)

---

## 🌟 About

**Project Nexus** is a scalable, multi-tenant platform designed for community-focused web applications. The BYN-K Platform is the flagship implementation, serving as a central hub for the Banyamulenge refugee youth in Kenya. It provides curated opportunities including jobs, scholarships, internships, fellowships, and resources to help community members advance their careers.

### Key Features

- 🎯 **Opportunities** – Curated jobs, scholarships, internships, and fellowships
- 🤝 **Partners** – Directory of organizations supporting the community
- 📖 **Resources** – Guides, tutorials, CV templates, and career advice
- 📅 **Events** – Workshops, webinars, career fairs, and networking sessions
- 🔖 **Bookmarks** – Save opportunities for later with personal notes

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | Next.js | 15 |
| **UI Library** | React | 19 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Backend Framework** | Django | 5.x |
| **API** | Django REST Framework | 3.16 |
| **Database** | PostgreSQL | - |
| **Task Queue** | Celery + Redis | - |
| **Testing** | Playwright, Vitest | - |
| **CI/CD** | GitHub Actions | - |

---

## 📁 Folder Structure

```
alx-project-nexus/
├── byn-k-platform/              # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # Reusable React components
│   │   ├── contexts/            # React context providers
│   │   ├── lib/                 # Utility functions and API helpers
│   │   └── types/               # TypeScript type definitions
│   ├── tests/
│   │   ├── e2e/                 # Playwright E2E tests
│   │   └── int/                 # Vitest integration tests
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
│
├── backend/                     # Django REST Framework Backend
│   ├── config/                  # Django project settings
│   │   ├── settings.py          # Main configuration
│   │   ├── urls.py              # URL routing
│   │   ├── celery.py            # Celery configuration
│   │   └── wsgi.py              # WSGI entry point
│   ├── users/                   # User authentication app
│   ├── listings/                # Opportunities/listings app
│   ├── templates/               # Django templates
│   ├── static/                  # Static files
│   ├── requirements.txt         # Python dependencies
│   └── manage.py                # Django CLI utility
│
├── README.md                    # This file
├── CONTRIBUTING.md              # Contribution guidelines
├── SECURITY.md                  # Security policy
└── render.yaml                  # Render deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.10.0 or higher
- **pnpm**: v9 or higher
- **Python**: 3.10 or higher
- **PostgreSQL**: 14 or higher (or SQLite for development)

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd byn-k-platform
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
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env  # If available, or create your own
   ```
   
   Configure the following in `.env`:
   ```env
   DJANGO_SECRET_KEY=your-secret-key-here
   DEBUG=True
   DATABASE_URL=sqlite:///db.sqlite3  # Or your PostgreSQL connection string
   ```

5. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

8. **Access the API:**
   - API: [http://localhost:8000/api/](http://localhost:8000/api/)
   - Admin: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## 🧪 Testing

### Frontend Tests

```bash
cd byn-k-platform

# Run all tests
pnpm test

# Run E2E tests (Playwright)
pnpm test:e2e

# Run integration tests (Vitest)
pnpm test:int

# Lint code
pnpm lint
```

### Backend Tests

```bash
cd backend

# Run tests
python manage.py test
```

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting a pull request.

---

## 🔒 Security

For security concerns and vulnerability reporting, please refer to our [Security Policy](./SECURITY.md).

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./byn-k-platform/LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Banyamulenge Youth of Kenya** – For inspiring this platform
- **ALX Software Engineering** – For the learning opportunity
- **Django & Django REST Framework** – For the robust backend framework
- **Next.js** – For the excellent frontend framework