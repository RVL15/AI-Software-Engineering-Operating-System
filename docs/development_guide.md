# ForgeMind X — Development Guide

This document defines environment setup guides, coding standards, branch strategies, and contribution procedures.

---

## Environment Setup Guide

### System Requirements
- **Java Development Kit (JDK) 21**
- **Maven 3.8+**
- **Node.js v18+ & npm v9+**
- **Docker Desktop & Docker Compose v2+** (Optional but highly recommended for containerized builds)

### CLI Startup Commands

#### Running the Backend
1. Build and install dependencies:
   ```bash
   cd backend
   mvn clean install
   ```
2. Start the local server profile:
   ```bash
   mvn spring-boot:run
   ```
   *The REST API will launch at `http://localhost:8080`.*

#### Running the Frontend
1. Install node dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the hot-reload Vite server:
   ```bash
   npm run dev
   ```
   *The React UI will launch at `http://localhost:5173`.*

---

## Coding Standards

### Backend (Java)
- **SOLID Principles**: Keep components focused on a single responsibility. Enforce dependency inversion.
- **Dependency Injection**: Always use **Constructor Injection**. Do not use `@Autowired` field injection.
- **REST Best Practices**: Enforce standard REST behaviors. Wrap JSON bodies with the unified `ApiResponse<T>` envelope.
- **Naming Conventions**: Use `camelCase` for variables/methods, `PascalCase` for classes/interfaces, and `UPPER_SNAKE_CASE` for constants.
- **Validation**: Enforce inputs checks at the controller boundary using Spring Validation annotations (`@Valid`, `@NotNull`, `@NotBlank`).

### Frontend (React & TypeScript)
- **Feature Folders**: Organize layouts, services, and hooks inside feature scopes (`dashboard`, `authentication`, `ai-workspace`, `settings`).
- **Verbatim Module Syntax**: Enforce type-only imports using `import type { ... }` when pulling TS definitions.
- **Tailwind Formatting**: Group utility class layouts using standard box-model patterns. Use `cn()` merger to combine custom conditional formatting.
- **Unused Rules**: Do not deploy unused variables, parameters, or packages. Make imports clean.

---

## Git Branch Strategy

We use a modified **GitFlow** branching strategy:

- `main`
  - Production stable code only. Every commit must be tagged with semver.
- `develop`
  - Integration branch. Active coding and automated PR validations occur here.
- `feature/<name>`
  - Short-lived developer branches branched from `develop` for specific objectives. Merged back to `develop` via pull requests.
- `bugfix/<name>`
  - Branches created to address issues found in `develop`.

---

## Contribution Guide

1. **Branch out**: Checkout a `feature/` or `bugfix/` branch from the latest `develop`.
2. **Commit guidelines**: Keep commit summaries brief and prefix them with category tags (e.g. `feat: add CORS mapping`, `fix: correct user principal deserializer`).
3. **Automated Verification**: Run backend test suits and frontend compilation tasks locally before pushing.
4. **Pull Requests**: Open a pull request against `develop`. The CI/CD actions pipeline must report success before code reviews are approved.
