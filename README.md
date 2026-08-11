# Task Management API

A simple, production-style REST API for managing tasks. Built with Node.js, Express, and MongoDB Atlas.

This project is intentionally kept simple so you can learn DevOps practices step by step (Git, Docker, AWS, CI/CD, monitoring, and more) on top of a real working application.

---

## Features

- Create, read, update, and delete tasks
- Task fields: title, description, status, priority, createdAt, updatedAt
- Status values: `pending`, `in-progress`, `completed`
- Priority values: `low`, `medium`, `high`
- Input validation and consistent JSON responses
- Centralized error handling
- Health check endpoint for later deployment and monitoring use
- Basic automated API tests

---

## Tech Stack

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

```
project-root/
│
├── src/
│   ├── controllers/     # Request handlers (business logic)
│   │   └── taskController.js
│   ├── models/          # Mongoose schemas/models
│   │   └── Task.js
│   ├── routes/          # Route definitions
│   │   ├── healthRoutes.js
│   │   └── taskRoutes.js
│   ├── middleware/      # Error handling and helpers
│   │   ├── asyncHandler.js
│   │   └── errorHandler.js
│   ├── config/          # Database configuration
│   │   └── db.js
│   └── app.js           # Express app setup
│
├── tests/               # Automated API tests
│   └── tasks.test.js
│
├── server.js            # Application entry point
├── package.json
├── .env.example         # Example environment variables
├── .gitignore
└── README.md
```

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
4. Under **Network Access**, allow your current IP address (or `0.0.0.0/0` for learning — less secure, fine for practice).
5. Click **Connect** → **Drivers** → copy the connection string.

It looks similar to:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
```

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

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
NODE_ENV=development
```

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

```
MongoDB connected: cluster0.xxxxx.mongodb.net
Server running in development mode on port 5000
```

5. Verify the health endpoint:

```
http://localhost:5000/api/health
```

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

```
Client request
  → server.js (starts app + DB connection)
    → src/app.js (Express middleware + routes)
      → src/routes/*.js
        → src/controllers/*.js
          → src/models/*.js (Mongoose → MongoDB Atlas)
        ← JSON response
  → middleware/errorHandler.js (if an error occurs)
```

---

## Notes for Your DevOps Journey

This repository is ready for you to later add:

- Git / GitHub
- Docker / Docker Compose
- AWS EC2 deployment
- GitHub Actions (CI/CD)
- Monitoring, logging, security, and infrastructure automation

Those steps are intentionally **not** included yet so you can learn them hands-on.
