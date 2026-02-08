# Contributing to BYN-K Platform

Thank you for your interest in contributing to the BYN-K Platform! This document provides guidelines for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Git Flow](#git-flow)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Secure Coding Guidelines](#secure-coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment following the [README](./README.md)
4. Create a feature branch from `main` or `develop`

```bash
git checkout main
git checkout -b feature/your-feature-name
```

---

## Git Flow

We follow a standard Git Flow workflow to maintain a clean and organized codebase.

### Branch Naming Convention

| Branch Type | Naming Pattern | Example |
|-------------|----------------|---------|
| Feature | `feature/<description>` | `feature/add-job-filters` |
| Bug Fix | `fix/<description>` | `fix/login-redirect-issue` |
| Hotfix | `hotfix/<description>` | `hotfix/critical-auth-bug` |
| Documentation | `docs/<description>` | `docs/update-readme` |
| Refactor | `refactor/<description>` | `refactor/api-structure` |

### Workflow

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit regularly with descriptive messages.

3. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** against `main` (or `develop` if applicable).

5. **Address review feedback** and ensure all CI checks pass.

6. **Merge** once approved (squash merge preferred for cleaner history).

---

## Development Workflow

1. **Make changes** in your feature branch
2. **Write tests** for your changes
3. **Run the test suite** to ensure all tests pass
4. **Run linting** to ensure code quality
5. **Commit your changes** with clear, descriptive messages
6. **Push** to your fork and submit a Pull Request

---

## Coding Standards

### Frontend (Next.js / TypeScript)

We use **Prettier** for code formatting and **ESLint** for code quality.

#### Running Linters

```bash
cd byn-k-platform

# Run ESLint
pnpm lint

# Format code with Prettier (if configured)
pnpm prettier --write .
```

#### ESLint Rules

- Follow the Next.js ESLint configuration (`eslint-config-next`)
- Fix all ESLint errors before submitting a PR
- Warnings should be addressed when possible

#### Prettier Configuration

The project uses the following Prettier settings (`.prettierrc.json`):
- Use single quotes
- Trailing commas
- 2-space indentation

### Backend (Django / Python)

We follow **PEP 8** style guidelines for Python code.

#### Style Guidelines

- **Indentation**: 4 spaces (no tabs)
- **Line length**: Maximum 79 characters for code, 72 for docstrings
- **Imports**: Group imports (standard library, third-party, local) with blank lines between groups
- **Naming conventions**:
  - `snake_case` for functions and variables
  - `PascalCase` for classes
  - `UPPER_CASE` for constants

#### Running Linters

```bash
cd backend

# Install flake8 (if not installed)
pip install flake8

# Run flake8
flake8 .

# For auto-formatting, use black (optional)
pip install black
black .
```

---

## Commit Message Guidelines

We use **Conventional Commits** format for clear and meaningful commit history.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, no logic changes) |
| `refactor` | Code refactoring (no feature or bug fix) |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks (build, CI, dependencies) |
| `security` | Security improvements or fixes |

### Examples

```bash
# Feature
feat(listings): add job category filter

# Bug fix
fix(auth): resolve login redirect issue on mobile

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(api): simplify error handling middleware

# Security
security(auth): implement rate limiting on login endpoint
```

### Best Practices

- **Keep it concise**: Subject line should be 50 characters or less
- **Use imperative mood**: "Add feature" not "Added feature"
- **Be descriptive**: Explain what and why, not how
- **Reference issues**: Include issue numbers when applicable (`fixes #123`)

## Secure Coding Guidelines

### 1. Never Commit Secrets

- ❌ Don't commit API keys, passwords, or tokens
- ✅ Use environment variables for all sensitive data
- ✅ Add sensitive files to `.gitignore`

```bash
# Bad
const apiKey = "sk-1234567890abcdef"

# Good
const apiKey = process.env.API_KEY
```

### 2. Input Validation

Always validate and sanitize user inputs:

```typescript
// ✅ Good - Server-side validation in Payload CMS
{
  name: 'email',
  type: 'email',
  required: true,
  validate: (value) => {
    if (!value || !isValidEmail(value)) {
      return 'Please enter a valid email address'
    }
    return true
  }
}
```

### 3. Access Control

Follow the principle of least privilege:

```typescript
// ✅ Good - Explicit access control
access: {
  read: () => true,
  create: ({ req: { user } }) => Boolean(user),
  update: ({ req: { user } }) => user?.roles?.includes('admin'),
  delete: ({ req: { user } }) => user?.roles?.includes('admin'),
}
```

### 4. SQL Injection Prevention

Always use parameterized queries through Payload ORM:

```typescript
// ✅ Good - Use Payload's query API
const users = await payload.find({
  collection: 'users',
  where: {
    email: { equals: userInput }
  }
})

// ❌ Bad - Never construct raw SQL queries with user input
```

### 5. Cross-Site Scripting (XSS) Prevention

- Use React's built-in escaping
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Sanitize any HTML content before rendering

### 6. Authentication & Sessions

- Never store sensitive data in localStorage
- Use httpOnly cookies for authentication tokens
- Implement proper session management

### 7. Error Handling

Don't expose sensitive information in error messages:

```typescript
// ❌ Bad
catch (error) {
  return { error: `Database error: ${error.message}` }
}

// ✅ Good
catch (error) {
  console.error('Database error:', error) // Log internally
  return { error: 'An error occurred. Please try again.' }
}
```

### 8. Dependency Management

- Regularly update dependencies
- Review changelogs for security updates
- Run `pnpm audit` before committing

## Pull Request Process

### Before Submitting

1. Ensure your code follows the project's style guidelines
2. Run all tests: `pnpm test`
3. Run linting: `pnpm lint`
4. Update documentation if needed
5. Add tests for new functionality

### PR Requirements

- Clear description of changes
- Reference any related issues
- All CI checks must pass
- At least one approval required
- No unresolved review comments

### PR Title Convention

Use conventional commits format:

- `feat: add new feature`
- `fix: resolve bug in X`
- `docs: update documentation`
- `security: fix vulnerability`
- `refactor: improve code structure`
- `test: add tests for X`

## Testing Requirements

### Unit/Integration Tests

```bash
# Run all tests
pnpm test

# Run integration tests only
pnpm test:int

# Run e2e tests
pnpm test:e2e
```

### Test Coverage

- New features must have corresponding tests
- Bug fixes should include regression tests
- Aim for meaningful coverage, not just percentage

### Security Testing

Consider these aspects when testing:
- Authentication bypass attempts
- Authorization checks for different roles
- Input validation edge cases
- Error handling behavior

## Questions?

If you have questions about contributing, please open an issue or reach out to the maintainers.

Thank you for contributing to the BYN-K Platform! 🙏
