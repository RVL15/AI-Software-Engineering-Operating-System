# ForgeMind X — AI Software Engineering Operating System

> **Transform a simple software idea into a production-ready application through autonomous AI engineering agents.**

This repository contains the **Phase 0: Project Foundation** of ForgeMind X. This phase establishes a production-ready, clean, scalable, and enterprise-grade architecture for both frontend and backend, with complete DevOps configurations and documentation. No business logic or AI agent workflows are implemented in this phase.

---

## Technical Stack Core

- **Backend**: Java 21, Spring Boot 3.4.x, Spring Security (Stateless JWT), Spring Data JPA, Hibernate, Flyway Migrations, Spring Boot Actuator, Springdoc OpenAPI, Maven.
- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, Lucide icons, Sonner notifications.
- **Database**: PostgreSQL 16, Redis 7.
- **DevOps**: Docker, Docker Compose, GitHub Actions.

---

## Directory Navigation

- [backend/](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/backend): Clean Architecture Spring Boot core.
- [frontend/](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/frontend): Feature-based React workspace.
- [docs/](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/docs): Project manuals:
  - [Project Architecture Manual](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/docs/architecture.md)
  - [Technology Stack Breakdown](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/docs/tech_stack.md)
  - [Monorepo Folder Structures](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/docs/folder_structure.md)
  - [Development & Environment Guides](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/docs/development_guide.md)

---

## Local Development Setup

Refer to the [Development Guide](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/docs/development_guide.md) for full commands and options.

### Quick Start
1. **Database & Cache Setup**:
   Start PostgreSQL and Redis container dependencies:
   ```bash
   docker compose up db cache -d
   ```
2. **Launch Backend REST API**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   - OpenAPI Swagger Docs: `http://localhost:8080/swagger-ui.html`
   - Actuator Health Checks: `http://localhost:8080/actuator/health`
3. **Launch Frontend Web SPA**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Dev dashboard interface: `http://localhost:5173`

---

## Automated Verification Status

- [x] Backend compilation successful (`BUILD SUCCESS`).
- [x] Backend JUnit tests passing (`4 tests passed`).
- [x] Frontend React compilation successful (`tsc -b && vite build` succeeded).
- [x] Docker configurations written ([docker-compose.yml](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/docker-compose.yml), [backend/Dockerfile](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/backend/Dockerfile), [frontend/Dockerfile](file:///c:/Users/Admin/Desktop/PROJECTS/FORDGEX/frontend/Dockerfile)).
- [x] Documentation complete.
