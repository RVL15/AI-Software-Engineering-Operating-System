# ForgeMind X — Folder Structure

Below is the directory mapping for Phase 0 Project Foundation of **ForgeMind X**.

```text
FORDGEX/
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI/CD Pipeline
│
├── backend/                         # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fordgex/forgemind/
│   │   │   │   ├── config/          # Global configurations (CORS, OpenApi)
│   │   │   │   ├── common/          # Base utilities and API response structures
│   │   │   │   ├── controller/      # REST API Controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA Entities
│   │   │   │   ├── exception/       # Exception handlers and custom domains
│   │   │   │   ├── repository/      # JPA Data repositories
│   │   │   │   ├── security/        # JWT filter chain and user auth details
│   │   │   │   └── ForgeMindApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── db/migration/    # Flyway schema files
│   │   │       ├── application.yml  # Global configuration
│   │   │       └── application-local.yml
│   │   │
│   │   └── test/                    # JUnit tests
│   │
│   ├── Dockerfile                   # Multi-stage JVM runtime container
│   └── pom.xml                      # Maven project dependencies
│
├── frontend/                        # React Application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── ai-workspace/            # Future agent view templates
│   │   ├── authentication/          # User login and signups
│   │   ├── dashboard/               # Core analytics and layout views
│   │   ├── settings/                # Settings forms
│   │   ├── shared/                  # Common library resources
│   │   │   ├── components/          # Reusable visual widgets
│   │   │   ├── hooks/               # React custom hooks (useTheme)
│   │   │   ├── layouts/             # Grid workspaces (MainLayout)
│   │   │   ├── pages/               # Routing canvases (NotFoundPage, ErrorPage)
│   │   │   ├── services/            # REST API service client (apiClient)
│   │   │   └── utils/               # Formatting helper scripts (cn)
│   │   ├── App.tsx                  # Core router definition
│   │   ├── index.css                # Base Tailwind styling directives
│   │   └── main.tsx                 # Application mounting point
│   │
│   ├── Dockerfile                   # Multi-stage Nginx container
│   ├── nginx.conf                   # Routing configurations for SPA
│   ├── package.json                 # Node dependencies
│   ├── postcss.config.js            # PostCSS compiling
│   ├── tailwind.config.js           # Tailwind theme variables
│   ├── tsconfig.json                # TypeScript definitions
│   └── vite.config.ts               # Vite server variables
│
├── docker-compose.yml               # Service containers orchestration
└── README.md                        # Root operations overview
```
