# Task Management API

![CI Pipeline](https://github.com/ParthVaishnavDev/devops-task-management/actions/workflows/ci.yml/badge.svg)

A simple, production-style REST API for managing tasks. Built with Node.js, Express, and MongoDB Atlas — deployed on AWS with a fully automated CI/CD pipeline.

This project started as a simple app and is being used to learn and demonstrate real-world DevOps practices: containerization, CI/CD, security scanning, and cloud deployment on AWS.

---

## DevOps & Infrastructure

This project isn't just deployed manually — every push to `main` runs through an automated pipeline that tests, security-scans, builds, and deploys the app with zero manual intervention.

### Architecture
Developer
│
▼
GitHub ──push──▶ GitHub Actions
│
├── 1. Checkout code
├── 2. Install dependencies (npm ci)
├── 3. Run automated tests (Jest + Supertest, against MongoDB Atlas)
├── 4. Build Docker image (multi-stage build)
├── 5. Trivy security scan (blocks on CRITICAL/HIGH vulnerabilities)
├── 6. Push image → Amazon ECR (private registry)
│
▼
AWS EC2
│
├── Pull latest image from ECR
├── Stop old container
└── Start new container
│
▼
Nginx (reverse proxy)
│
▼
Application (port 5000)

### DevOps Highlights

- **CI/CD**: Fully automated pipeline via GitHub Actions — every `git push` triggers test → scan → build → deploy, with no manual server access required
- **Containerization**: Multi-stage Docker build — dependencies are installed in a build stage, and the final image strips out `npm` and dev tooling entirely, reducing both image size and attack surface
- **Security scanning**: Trivy scans every image for CRITICAL/HIGH vulnerabilities and **fails the pipeline** if any are found — this isn't just a report, it's an enforced gate
- **Private container registry**: Images are stored in a private Amazon ECR repository, not a public registry
- **Least-privilege IAM**: Separate, narrowly-scoped IAM users for different systems — one for EC2 (pull-only access to ECR), one for GitHub Actions (push access) — instead of using root or shared credentials
- **Secrets management**: Database credentials, AWS keys, and SSH keys are stored as encrypted GitHub Actions secrets, never committed to the repository
- **Zero-touch deployment**: GitHub Actions connects to EC2 via SSH and handles the full container lifecycle (pull → stop old → start new) automatically

### Tech Stack (Infrastructure)

| Tool | Purpose |
|---|---|
| Docker | Containerization (multi-stage builds) |
| GitHub Actions | CI/CD automation |
| Trivy | Container vulnerability scanning |
| Amazon ECR | Private Docker image registry |
| AWS EC2 | Application hosting |
| Nginx | Reverse proxy |
| AWS IAM | Least-privilege access control |

---

## Features

- Create, read, update, and delete tasks
- Task fields: title, description, status, priority, createdAt, updatedAt
- Status values: `pending`, `in-progress`, `completed`
- Priority values: `low`, `medium`, `high`
- Input validation and consistent JSON responses
- Centralized error handling
- Health check endpoint for deployment and monitoring use
- Basic automated API tests

---

## Tech Stack (Application)

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework / REST API |
| MongoDB Atlas | Cloud database (no local MongoDB required) |
| Mongoose | ODM for MongoDB |
| JavaScript | Language |
| Jest + Supertest | Automated API tests |
| Nodemon | Auto-restart during development |
| dotenv | Load environment variables |

---

## Project Structure
project-root/
│
├── .github/
│ └── workflows/
│ └── ci.yml # CI/CD pipeline definition
│
├── src/
│ ├── controllers/ # Request handlers (business logic)
│ │ └── taskController.js
│ ├── models/ # Mongoose schemas/models
│ │ └── Task.js
│ ├── routes/ # Route definitions
│ │ ├── healthRoutes.js
│ │ └── taskRoutes.js
│ ├── middleware/ # Error handling and helpers
│ │ ├── asyncHandler.js
│ │ └── errorHandler.js
│ ├── config/ # Database configuration
│ │ └── db.js
│ └── app.js # Express app setup
│
├── tests/ # Automated API tests
│ └── tasks.test.js
│
├── server.js # Application entry point
├── Dockerfile # Multi-stage production build
├── package.json
├── .env.example # Example environment variables
├── .gitignore
└── README.md

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- Optional: [MongoDB Compass](https://www.mongodb.com/products/tools/compass) to inspect the database visually

You do **not** need to install MongoDB locally. This project uses MongoDB Atlas (cloud).

---

## MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **cluster** (the free M0 tier is fine).
3. Under **Database Access**, create a database user (username + password). Save the password securely.
4. Under **Network Access**, allow your current IP address (or `0.0.0.0/0` — required for GitHub Actions runners, which use dynamic IPs).
5. Click **Connect** → **Drivers** → copy the connection string.

It looks similar to:
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
Replace `<username>` and `<password>` with your real credentials.
Use a database name such as `task-manager` in the connection string (after `.net/`).

---

## MongoDB Compass Connection

MongoDB Compass is a GUI for browsing your Atlas data.

1. Install [MongoDB Compass](https://www.mongodb.com/products/tools/compass).
2. Open Compass.
3. Paste the **same Atlas connection string** you use in `MONGODB_URI`.
4. Click **Connect**.
5. Open the database (for example `task-manager`) and the `tasks` collection to view documents created by the API.

---

## Environment Variable Setup

1. Copy the example file:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

2. Open `.env` and set your values:
3. PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
NODE_ENV=development
| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `NODE_ENV` | Environment name (`development`, `production`, `test`) |

**Important:** Never commit `.env`. It is listed in `.gitignore`. Only `.env.example` (without secrets) is safe to commit.

---

## How to Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create and configure `.env` (see above).

3. Start the API in development mode (auto-restarts on file changes):

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

4. You should see messages similar to:
5. MongoDB connected: cluster0.xxxxx.mongodb.net
Server running in development mode on port 5000
5. Verify the health endpoint:
6. http://localhost:5000/api/health

7. ---

## Running with Docker

Build and run the production image locally:

```bash
docker build -t task-management-api .
docker run -d --name task-management-api -p 5000:5000 --env-file .env task-management-api
```

The Dockerfile uses a **multi-stage build**: dependencies are installed in a build stage, and the final image contains only the runtime files needed to run the app — no `npm`, no dev dependencies.

---

## CI/CD Pipeline

Every push to `main` triggers `.github/workflows/ci.yml`, which runs three jobs in sequence:

1. **test** — installs dependencies and runs the Jest/Supertest suite against a MongoDB Atlas test database
2. **build-and-scan** — builds the Docker image and scans it with Trivy; the pipeline fails if any CRITICAL or HIGH severity vulnerabilities are found
3. **deploy** — pushes the image to Amazon ECR, then connects to the EC2 instance via SSH to pull the new image and restart the container

Each job depends on the previous one passing (`needs:`), so a failing test or a failed security scan blocks deployment entirely.

---

## API Endpoints

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get a task by ID |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Success response shape

```json
{
  "success": true,
  "data": { }
}
```

### Error response shape

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Example API Requests

### Health check

```bash
curl http://localhost:5000/api/health
```

### Create a task

```bash
curl -X POST http://localhost:5000/api/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Learn Docker\",\"description\":\"Containerize the Task API\",\"status\":\"pending\",\"priority\":\"high\"}"
```

macOS/Linux:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker","description":"Containerize the Task API","status":"pending","priority":"high"}'
```

### Get all tasks

```bash
curl http://localhost:5000/api/tasks
```

### Get a task by ID

```bash
curl http://localhost:5000/api/tasks/<TASK_ID>
```

### Update a task

```bash
curl -X PUT http://localhost:5000/api/tasks/<TASK_ID> ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"in-progress\",\"priority\":\"medium\"}"
```

macOS/Linux:

```bash
curl -X PUT http://localhost:5000/api/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress","priority":"medium"}'
```

### Delete a task

```bash
curl -X DELETE http://localhost:5000/api/tasks/<TASK_ID>
```

### Example task JSON body

```json
{
  "title": "Learn Docker",
  "description": "Containerize the Task API",
  "status": "pending",
  "priority": "high"
}
```

Allowed values:

- **status:** `pending` | `in-progress` | `completed`
- **priority:** `low` | `medium` | `high`

---

## How to Run Tests

Tests use Jest and Supertest against your MongoDB Atlas database.

1. Ensure `.env` exists and `MONGODB_URI` points to Atlas.
2. Prefer a dedicated database name for tests (for example `task-manager-test`) so test data stays separate.
3. Run:

```bash
npm test
```

What is covered:

1. Health endpoint
2. Create task
3. Get tasks
4. Get task by ID
5. Update task
6. Delete task
7. Basic validation / 404 cases

---

## Request Flow (for learning)
Client request
→ server.js (starts app + DB connection)
→ src/app.js (Express middleware + routes)
→ src/routes/.js
→ src/controllers/.js
→ src/models/*.js (Mongoose → MongoDB Atlas)
← JSON response
→ middleware/errorHandler.js (if an error occurs)
---

## DevOps Learning Journey

This project is being used to practice and demonstrate real-world DevOps skills, building up in stages:

- [x] Git / GitHub version control
- [x] Docker containerization (multi-stage builds)
- [x] AWS EC2 deployment with Nginx reverse proxy
- [x] Amazon ECR private container registry
- [x] GitHub Actions CI/CD pipeline
- [x] Automated testing in CI
- [x] Trivy security scanning as a pipeline gate
- [x] Least-privilege IAM access control
- [x] Automated deployment via SSH
- [ ] HTTPS / TLS (planned — requires a domain)
- [ ] Monitoring & observability (Prometheus, Grafana, CloudWatch)
- [ ] Infrastructure as Code (Terraform)
- [ ] Kubernetes deployment
