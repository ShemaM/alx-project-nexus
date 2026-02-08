# Contributing to BYN-K Platform

Thank you for your interest in contributing to the **BYN-K Community Platform**! This document provides professional guidelines for contributing to Project Nexus.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Style Guide](#style-guide)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Peer Review Guidelines](#peer-review-guidelines)
- [Testing Requirements](#testing-requirements)
- [Secure Coding Guidelines](#secure-coding-guidelines)

---

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. Set up the development environment following the [README](./README.md)
4. Create a **feature branch** from `main` or `develop`

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

---

## Development Workflow

Our workflow follows ProDev industry standards for collaborative development:

1. **Create a feature branch** from `main` (see [Branching Strategy](#branching-strategy))
2. **Make changes** in your feature branch
3. **Write tests** for your changes
4. **Run linting and tests** to ensure code quality
5. **Commit your changes** using conventional commits
6. **Push** to your fork and submit a Pull Request
7. **Address review feedback** from peer reviewers
8. **Merge** after approval

---

## Branching Strategy

We use a feature-branch workflow with the following conventions:

| Branch Type | Naming Convention        | Description                              |
| ----------- | ------------------------ | ---------------------------------------- |
| Feature     | `feature/branch-name`    | New features or enhancements             |
| Bug Fix     | `fix/branch-name`        | Bug fixes                                |
| Hotfix      | `hotfix/branch-name`     | Urgent production fixes                  |
| Docs        | `docs/branch-name`       | Documentation updates                    |
| Refactor    | `refactor/branch-name`   | Code refactoring without feature changes |

### Branch Naming Guidelines

- Use **lowercase** letters
- Use **hyphens** to separate words
- Be **descriptive** but concise
- Reference issue numbers when applicable

**Examples:**
```bash
feature/opportunity-listings
fix/bookmark-save-error
docs/api-documentation
refactor/user-authentication
feature/issue-42-user-profile
```

---

## Style Guide

Consistent code style is essential for maintainability. Our project enforces the following standards:

### Frontend (Next.js / TypeScript)

| Tool     | Purpose                    | Configuration          |
| -------- | -------------------------- | ---------------------- |
| Prettier | Code formatting            | `.prettierrc.json`     |
| ESLint   | Code linting & quality     | `eslint.config.mjs`    |

```bash
# Run linting
cd byn-k-platform
pnpm lint

# Format code (if Prettier is configured)
pnpm exec prettier --write .
```

**Frontend Style Rules:**
- Use **TypeScript** for all new code
- Prefer **functional components** with hooks
- Use **Tailwind CSS** for styling
- Keep components small and focused
- Use meaningful variable and function names

### Backend (Django / Python)

| Standard | Purpose                    | Enforcement            |
| -------- | -------------------------- | ---------------------- |
| PEP 8    | Python style guide         | Code review / linters  |

```bash
# Check PEP 8 compliance (install flake8 or ruff)
cd backend
pip install flake8
flake8 .

# Or using ruff (faster alternative)
pip install ruff
ruff check .
```

**Backend Style Rules:**
- Follow **PEP 8** naming conventions
- Use **snake_case** for functions and variables
- Use **PascalCase** for classes
- Keep functions focused and under 50 lines
- Document public APIs with docstrings

---

## Commit Message Convention

We enforce **Conventional Commits** for clear and consistent commit history.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                     |
| ---------- | ----------------------------------------------- |
| `feat`     | A new feature                                   |
| `fix`      | A bug fix                                       |
| `docs`     | Documentation only changes                      |
| `style`    | Formatting, missing semicolons, etc.            |
| `refactor` | Code change that neither fixes nor adds feature |
| `test`     | Adding missing tests                            |
| `chore`    | Maintenance tasks, dependencies                 |
| `perf`     | Performance improvements                        |
| `ci`       | CI/CD configuration changes                     |
| `security` | Security improvements or fixes                  |

### Examples

```bash
# Feature
feat(listings): add opportunity search functionality

# Bug fix
fix(bookmarks): resolve save button not responding

# Documentation
docs(readme): update getting started section

# Refactor
refactor(auth): simplify user authentication flow

# Multiple scopes
feat(api,frontend): implement user profile endpoints
```

### Breaking Changes

For breaking changes, add `!` after the type or include `BREAKING CHANGE:` in the footer:

```bash
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: The /api/auth endpoint now requires Bearer token
```

---

## Pull Request Process

### Before Submitting

1. ✅ Ensure your branch is up-to-date with `main`
2. ✅ Run all tests and linting
3. ✅ Update documentation if needed
4. ✅ Add tests for new functionality
5. ✅ Self-review your code changes

### PR Requirements

| Requirement              | Description                                    |
| ------------------------ | ---------------------------------------------- |
| Clear description        | Explain what and why                           |
| Issue reference          | Link to related issues (e.g., `Closes #42`)    |
| CI checks pass           | All automated checks must succeed              |
| Peer review approval     | At least one approval required                 |
| No unresolved comments   | Address all review feedback                    |

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No sensitive data exposed
```

---

## Peer Review Guidelines

### For Reviewers

- **Be respectful** and constructive
- Focus on **code quality**, not personal preferences
- Look for **potential bugs**, security issues, and edge cases
- Ensure **tests** adequately cover changes
- Check for **documentation** updates if needed
- Approve only when all concerns are addressed

### Review Checklist

- [ ] Code is readable and well-organized
- [ ] No unnecessary code duplication
- [ ] Error handling is appropriate
- [ ] Security best practices followed
- [ ] Tests cover the changes
- [ ] Documentation is updated

### Responding to Reviews

- Address all comments before requesting re-review
- Explain your reasoning when disagreeing
- Mark resolved conversations
- Request re-review when ready

---

## Testing Requirements

### Frontend Tests

```bash
cd byn-k-platform

# Run all tests
pnpm test

# Run integration tests only (Vitest)
pnpm test:int

# Run end-to-end tests (Playwright)
pnpm test:e2e
```

### Backend Tests

```bash
cd backend

# Run Django tests
python manage.py test
```

### Test Coverage Expectations

- New features **must** have corresponding tests
- Bug fixes **should** include regression tests
- Aim for **meaningful coverage**, not just percentage
- Critical paths require **end-to-end tests**

---

## Secure Coding Guidelines

### 1. Never Commit Secrets

```bash
# ❌ Bad
const apiKey = "sk-1234567890abcdef"

# ✅ Good
const apiKey = process.env.API_KEY
```

### 2. Input Validation

Always validate and sanitize user inputs on both frontend and backend.

### 3. Access Control

Follow the principle of least privilege for all API endpoints.

### 4. Dependency Management

```bash
# Frontend - Check for vulnerabilities
pnpm audit

# Backend - Check for vulnerabilities
pip install safety
safety check
```

---

## Questions?

If you have questions about contributing, please:
- Open an issue for clarification
- Reach out to the maintainers
- Check existing documentation

---

<p align="center">
  <strong>Thank you for contributing to the BYN-K Platform! 🙏</strong>
</p>
