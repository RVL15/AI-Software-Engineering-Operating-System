# ForgeMind X — Technology Stack

This document details the software libraries, framework runtimes, and databases configuring the foundation of **ForgeMind X**.

---

## Backend Services & Runtimes

* **Java Development Kit (JDK 21)**
  - Vendor: Eclipse Temurin (LTS release).
  - Modern language features: Records, Pattern matching, Virtual threads (Loom preview), and Structured concurrency.
* **Spring Boot (3.4.1)**
  - Core MVC engine managing IoC beans.
  - Dependency Injection (constructor-based injection enforced).
* **Spring Security (6.4.x)**
  - Stateless servlet filtering with custom JWT headers.
  - BCrypt password encoding (strength level 10).
* **Spring Data JPA & Hibernate (6.x)**
  - Object-Relational Mapping (ORM) connecting Java entities to Postgres databases.
  - Hibernate Dialect: `org.hibernate.dialect.PostgreSQLDialect`.
* **Flyway Core**
  - Database schema versioning. Migrations loaded automatically from `src/main/resources/db/migration/`.
* **Spring Boot Actuator**
  - Production-ready observability metrics. Exposing `/actuator/health` and `/actuator/info`.
* **Springdoc OpenAPI UI (2.6.0)**
  - OpenAPI 3 web dashboard loaded at `/swagger-ui.html`. Includes JWT security authentication definitions.
* **JSON Web Tokens (io.jsonwebtoken:jjwt-api:0.12.6)**
  - HS256-signed stateless token generator and parser.

---

## Database Systems

* **PostgreSQL (16)**
  - Principal relational transactional system.
  - Docker Container: `postgres:16-alpine`.
* **Redis (7)**
  - High-performance caching registry.
  - Docker Container: `redis:7-alpine`.

---

## Frontend Web Stack

* **React (19.2.7) + TypeScript (6.0.2)**
  - Declarative component composition and strict static typing.
* **Vite (8.1.1)**
  - Fast, modular development bundler utilizing Hot Module Replacement (HMR).
* **Tailwind CSS (3.4.15)**
  - Utility-first CSS styling frameworks.
* **Lucide React**
  - Premium line icons library.
* **Sonner**
  - Premium toast notifications dispatcher.

---

## DevOps & Orchestration

* **Docker (Engine 24+) & Docker Compose (v2)**
  - Service containment and orchestration.
* **GitHub Actions**
  - Continuous integration workflows building and testing Maven and npm runtimes on pushes to `main` and `develop`.
