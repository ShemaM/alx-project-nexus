# Contributing to BYN-K Platform

Thank you for your interest in contributing to the BYN-K Platform! This document provides guidelines for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Secure Coding Guidelines](#secure-coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment following the [README](./byn-k-platform/README.md)
4. Create a feature branch from `develop`

```bash
git checkout develop
git checkout -b feature/your-feature-name
```

## Development Workflow

1. **Make changes** in your feature branch
2. **Write tests** for your changes
3. **Run the test suite** to ensure all tests pass
4. **Run linting** to ensure code quality
5. **Commit your changes** with clear, descriptive messages
6. **Push** to your fork and submit a Pull Request

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
