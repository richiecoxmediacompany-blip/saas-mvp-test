# CLAUDE.md - AI Assistant Guide for saas-mvp-test

## Project Overview

This is a SaaS MVP (Minimum Viable Product) project in its initial setup phase. The repository is freshly initialized and ready for development.

- **Repository**: saas-mvp-test
- **Status**: Initial setup — no framework, dependencies, or source code have been added yet
- **Default branch**: master

## Repository Structure

```
saas-mvp-test/
├── README.md          # Project readme (minimal)
├── CLAUDE.md          # This file — AI assistant guide
└── .git/              # Git metadata
```

The project has no source code, configuration files, or dependencies yet. The structure above reflects the current state.

## Development Setup

No development environment is configured yet. When setting up the project, the following decisions need to be made:

- **Language/Framework**: Not yet chosen (e.g., Node.js/Express, Next.js, Python/Django, etc.)
- **Database**: Not yet chosen
- **Package manager**: Not yet chosen
- **Testing framework**: Not yet chosen
- **Linting/Formatting**: Not yet configured

## Commands

No build, test, or lint commands are available yet. This section should be updated as tooling is added.

<!-- Example format for when commands are added:
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run all tests
npm run test -- --watch  # Run tests in watch mode
npm run lint         # Run linter
npm run lint:fix     # Auto-fix lint issues
```
-->

## Code Conventions

No code conventions have been established yet. When they are, document them here. Key areas to define:

- Code style and formatting rules
- Naming conventions (files, variables, functions, components)
- Import ordering
- Error handling patterns
- API response formats
- Git commit message format

## Architecture

No architecture decisions have been made yet. When building out the project, document:

- Overall application architecture (monolith, microservices, serverless)
- Frontend framework and patterns
- Backend API design (REST, GraphQL)
- Database schema approach
- Authentication strategy
- State management approach

## Environment Variables

No environment variables are configured. When added, list required variables here (without secret values):

<!-- Example:
```
DATABASE_URL=         # Database connection string
API_KEY=              # Third-party API key
JWT_SECRET=           # JWT signing secret
NODE_ENV=             # development | production | test
```
-->

## Key Guidelines for AI Assistants

1. **This is a greenfield project** — there are no existing patterns to follow yet. Propose clear, well-structured approaches when building new features.
2. **Keep it simple** — this is an MVP. Avoid over-engineering. Choose straightforward solutions over complex architectures.
3. **Update this file** — as the project grows, keep CLAUDE.md current with new conventions, commands, and architecture decisions.
4. **Update README.md** — ensure the README reflects setup instructions and project description as the codebase evolves.
5. **Security first** — even for an MVP, follow security best practices (input validation, parameterized queries, no secrets in code).
6. **Test coverage** — when a test framework is added, write tests for new functionality.
