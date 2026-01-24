# Project Nexus

## Overview

Project Nexus is an initiative to build a scalable, multi-tenant platform for creating community-focused web applications. The goal is to provide a reusable, robust, and customizable foundation that can be rapidly deployed and configured for various communities, each with its unique content and needs. This core platform, "Nexus," is designed to be a configurable system that different organizations can use as a starting point, saving significant time and resources in development.

## Case Study: The Banyamulenge Youth of Kenya (BYN-K) Platform

This repository is the first implementation of the Project Nexus vision, a dedicated platform for the Banyamulenge Youth of Kenya (BYN-K). It serves as a central hub for this community, offering:

- **Opportunity Listings:** A curated list of jobs, scholarships, and other opportunities.
- **Partner Directory:** A directory of organizations that partner with the BYN-K community.
- **Resource Hub:** A place for sharing important information and resources.
- **Community Engagement:** Features like user accounts and bookmarking to foster engagement.

The BYN-K platform showcases the power of Project Nexus by providing a real-world application that is both functional and tailored to the specific needs of its users.

## Tech Stack & Rationale

The technologies for Project Nexus were chosen to prioritize developer experience, scalability, and maintainability.

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend/CMS:** [Payload CMS](https://payloadcms.com/)
- **Database & BaaS:** [Supabase](https://supabase.io/) (using PostgreSQL)
- **Testing:** [Playwright](https://playwright.dev/) & [Vitest](https://vitest.dev/)
- **Deployment:** [Docker](https://www.docker.com/)

### Why Payload CMS?

Payload was chosen as our content management system and application framework for several key reasons:

- **Code-First & TypeScript-Native:** Unlike traditional CMSs, Payload allows us to define our data structures directly in TypeScript code. This provides strong typing from the database to the frontend, reducing errors and improving developer productivity.
- **Extensible & Customizable:** It's built to be a developer-first platform. We can easily extend its core functionality, customize the admin UI with our own React components, and integrate it seamlessly into our Next.js application.
- **Self-Hosted & Scalable:** Being able to self-host gives us full control over our data and infrastructure. It runs as a standard Node.js application, which can be easily containerized and scaled.
- **Powerful Features Out-of-the-Box:** Payload provides a rich feature set, including a flexible field editor, authentication, file uploads, and a robust GraphQL API, which significantly accelerated our development process.

*Alternatives considered: We evaluated other headless CMSs like **Strapi** and **Contentful**. However, Payload's deep integration with the React ecosystem, its code-first approach, and the lack of limitations on the self-hosted version made it the ideal choice for Project Nexus.*

### Why Supabase?

Supabase serves as our backend-as-a-service (BaaS) platform, primarily for its PostgreSQL database and other integrated services.

- **Open Source & PostgreSQL-Based:** Supabase is built on top of PostgreSQL, a powerful and reliable open-source relational database. This allows us to leverage the power of SQL for complex queries while benefiting from Supabase's user-friendly interface.
- **More than a Database:** It's an open-source alternative to Firebase. While we are currently using it for its database, it offers a suite of tools including authentication, storage, and auto-generated APIs that can be leveraged as Project Nexus grows.
- **Excellent Developer Experience:** Supabase provides a clean dashboard for database management, easy-to-use client libraries, and clear documentation. This simplifies database administration and allows developers to focus on building features.

*Alternatives considered: We could have used a managed **PostgreSQL** service from a cloud provider like AWS RDS. However, Supabase offers a more comprehensive package with its additional services and a more intuitive developer experience, making it a better fit for rapid application development.*

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18.20.2 or >=20.9.0)
- pnpm (v9 or v10)
- Docker (optional, for running a local PostgreSQL instance)

### Installation

1.**Clone the repository:**
    ```bash
    git clone <repository-url>
    cd byn-k-platform
    ```

2.**Install dependencies:**
    ```bash
    pnpm install
    ```

3.**Set up environment variables:**
    Copy the example environment file and update it with your configuration.
    ```bash
    cp .env.example .env
    ```
    You will need to provide a `DATABASE_URL` for your PostgreSQL database (ideally from a Supabase project) and a `PAYLOAD_SECRET`.

4.**Run the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000). The Payload admin panel will be at [http://localhost:3000/admin](http://localhost:3000/admin).

### Using Docker for Local Development

If you prefer to use Docker for a consistent development environment, you can use the provided `docker-compose.yml` file to run a PostgreSQL database.

1.Ensure you have Docker installed and running.
2.  In your `.env` file, set the `DATABASE_URL` to `postgresql://payload:payload@localhost:5432/payload`.
3.  Start the Docker container:
    ```bash
    docker-compose up -d
    ```
4.  Run the development server:
    ```bash
    pnpm dev
    ```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: The connection string for your PostgreSQL database.
- `PAYLOAD_SECRET`: A secret key used by Payload for authentication.
- `NEXT_PUBLIC_SERVER_URL`: The public URL of your server (e.g., `http://localhost:3000`).

## Running Tests

The project includes both end-to-end and integration tests.

-**Run all tests:**
    ```bash
    pnpm test
    ```
-**Run end-to-end tests:**
    ```bash
    pnpm test:e2e
    ```
-**Run integration tests:**
    ```bash
    pnpm test:int
    ```

## Seeding the Database

To populate the database with initial data, run the seed script:

```bash
pnpm seed
```

## Project Structure

-`src/app/(frontend)/`: Contains the Next.js pages for the user-facing application.
-`src/app/(payload)/`: Contains the Payload CMS admin panel and API.
-`src/collections/`: Defines the data models (schemas) for Payload CMS.
-`src/components/`: Shared React components used across the frontend.
-`src/lib/`: Utility functions and libraries.
-`src/payload.config.ts`: The main configuration file for Payload CMS.
-`tests/`: Contains all the tests.

## API

The application exposes a GraphQL API powered by Payload CMS. You can access the GraphQL playground at [http://localhost:3000/api/graphql-playground](http://localhost:3000/api/graphql-playground).

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
