# TaskFlow — Team Task Manager

A full-stack MERN web application where users can create projects, assign tasks, and track progress with role-based access control (Admin/Member). Admins manage users, projects, and teams. Members work on assigned tasks after admin approval.

---

## Features

- **Authentication** — Signup & Login with JWT tokens
- **User Approval Flow** — Self-signed-up users are inactive until admin activates them
- **User Management** — Admin can add users, change roles, enable/disable, delete
- **Projects** — Create, manage, and assign team members (Admin only)
- **Tasks** — Create, assign, set priority/due date, track status (To Do / In Progress / Done)
- **Dashboard** — Overview stats, overdue tasks, active tasks at a glance
- **Role-Based Access Control** — Admin vs Member permissions throughout
- **Responsive UI** — Works on desktop and mobile

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS        |
| Backend    | Node.js, Express 4                  |
| Database   | MongoDB (local or Atlas)            |
| Auth       | JWT + bcryptjs                      |
| Validation | express-validator                   |
| Notifications | react-hot-toast                  |

---

## Project Structure

```
boy/
├── server/                     # Express backend
│   ├── models/
│   │   ├── User.js             # name, email, password, role, isActive
│   │   ├── Project.js          # name, description, owner, members
│   │   └── Task.js             # title, status, priority, assignee, dueDate
│   ├── routes/
│   │   ├── auth.js             # signup, login, user CRUD
│   │   ├── projects.js         # project CRUD + member management
│   │   ├── tasks.js            # task CRUD with filters
│   │   └── dashboard.js        # aggregated stats
│   ├── middleware/
│   │   ├── auth.js             # JWT token verification
│   │   ├── activeCheck.js      # blocks inactive users
│   │   └── roleCheck.js        # admin-only route guard
│   ├── server.js               # app entry point
│   ├── seed.js                 # demo data seeder
│   ├── .env.example            # environment template
│   └── package.json
├── client/                     # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── PendingApproval.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Users.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx      # navbar + responsive layout
│   │   │   ├── Modal.jsx       # reusable modal
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # auth state management
│   │   └── api/
│   │       └── axios.js         # configured axios instance
│   ├── vite.config.js
│   └── package.json
├── package.json                # root convenience scripts
└── README.md
```

---

## Prerequisites

| Tool    | Version | Download |
|---------|---------|----------|
| Node.js | v18+    | https://nodejs.org |
| MongoDB | v6+     | https://www.mongodb.com/try/download/community |
| Git     | any     | https://git-scm.com |

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repo-url>
cd boy
```

### 2. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Configure Environment

```bash
cp server/.env.example server/.env
```

Default `.env` (works out of the box with local MongoDB):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 4. Seed Demo Data (Optional)

```bash
cd server && npm run seed
```

Creates:
| User           | Email            | Password    | Role   | Status |
|----------------|------------------|-------------|--------|--------|
| Admin User     | admin@test.com   | password123 | admin  | active |
| Alice Johnson  | alice@test.com   | password123 | member | active |
| Bob Smith      | bob@test.com     | password123 | member | active |

Plus 2 sample projects and 6 tasks with varying statuses, priorities, and due dates.

### 5. Start the Application

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

### 6. Open in Browser

```
http://localhost:5173
```

---

## Platform-Specific Setup

### Mac

```bash
# Install Node.js
brew install node

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
node --version
mongosh --eval "db.runCommand({ping:1})"
```

**Open terminal:** `Cmd + Space` → type "Terminal" → Enter

### Windows

1. Download & install **Node.js** from https://nodejs.org (check "Add to PATH")
2. Download & install **MongoDB Community** from https://www.mongodb.com/try/download/community
   - Select "Complete" setup
   - Check "Install MongoDB as a Service" (auto-starts)
3. Verify in **Command Prompt** or **PowerShell**:

```bash
node --version
mongosh --eval "db.runCommand({ping:1})"
```

**Open terminal:** `Win + R` → type `cmd` → Enter

**PowerShell note:** If scripts are blocked, run once:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Environment setup on Windows:**
```bash
copy server\.env.example server\.env
```

### Ubuntu / Linux

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
node --version
mongosh --eval "db.runCommand({ping:1})"
```

**Open terminal:** `Ctrl + Alt + T`

---

## Application Flow

### User Registration & Approval

```
User signs up ──► Account created (INACTIVE) ──► "Pending Approval" screen
                                                         │
Admin logs in ──► Users tab ──► Clicks "Inactive" ──► User becomes ACTIVE
                                                         │
                                         User can now access Dashboard,
                                         Projects, and Tasks
```

### Admin Creates a User

```
Admin ──► Users tab ──► "+ Add User" ──► Fills form ──► User created (ACTIVE)
```

### Role Permissions

| Feature                  | Admin | Member (Active) | Member (Inactive) |
|--------------------------|-------|-----------------|-------------------|
| View Dashboard           | Yes   | Yes             | No (pending screen) |
| View Projects            | All   | Assigned only   | No |
| Create Projects          | Yes   | No              | No |
| Delete Projects          | Yes   | No              | No |
| Add/Remove Members       | Yes   | No              | No |
| Create Tasks             | Yes   | Yes             | No |
| Update Task Status       | Yes   | Yes             | No |
| Delete Tasks             | Any   | Own only        | No |
| Manage Users             | Yes   | No              | No |
| Enable/Disable Users     | Yes   | No              | No |

---

## API Endpoints

### Auth

| Method | Endpoint            | Access | Description                           |
|--------|---------------------|--------|---------------------------------------|
| POST   | /api/auth/signup    | Public | Self-register (inactive by default)   |
| POST   | /api/auth/login     | Public | Login, returns JWT                    |
| GET    | /api/auth/me        | Auth   | Get current user profile              |
| GET    | /api/auth/users     | Auth   | List all users                        |
| POST   | /api/auth/users     | Admin  | Create user (active by default)       |
| PUT    | /api/auth/users/:id | Admin  | Update role, name, email, isActive    |
| DELETE | /api/auth/users/:id | Admin  | Delete user, cleanup refs             |

### Projects

| Method | Endpoint                         | Access       | Description           |
|--------|----------------------------------|--------------|-----------------------|
| POST   | /api/projects                    | Admin+Active | Create project        |
| GET    | /api/projects                    | Active       | List user's projects  |
| GET    | /api/projects/:id                | Active       | Project detail        |
| PUT    | /api/projects/:id                | Admin+Active | Update project        |
| DELETE | /api/projects/:id                | Admin+Active | Delete project+tasks  |
| POST   | /api/projects/:id/members        | Admin+Active | Add member            |
| DELETE | /api/projects/:id/members/:uid   | Admin+Active | Remove member         |

### Tasks

| Method | Endpoint          | Access       | Description                  |
|--------|-------------------|--------------|------------------------------|
| POST   | /api/tasks        | Active       | Create task                  |
| GET    | /api/tasks        | Active       | List tasks (filterable)      |
| GET    | /api/tasks/:id    | Active       | Task detail                  |
| PUT    | /api/tasks/:id    | Active       | Update task/status           |
| DELETE | /api/tasks/:id    | Active       | Delete (admin or creator)    |

**Task filters:** `?project=ID&status=todo&priority=high&assignee=ID`

### Dashboard

| Method | Endpoint         | Access | Description                    |
|--------|------------------|--------|--------------------------------|
| GET    | /api/dashboard   | Active | Stats, overdue & active tasks  |

---

## Production Build

Build the frontend and serve everything from Express:

```bash
# Build frontend
cd client && npm run build

# Start production server
cd ../server
NODE_ENV=production npm start
```

Everything runs on **http://localhost:5000**

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `mongosh` not found | Add MongoDB bin directory to system PATH |
| MongoDB not running (Mac) | `brew services start mongodb-community` |
| MongoDB not running (Windows) | Open Services (`services.msc`), start "MongoDB Server" |
| MongoDB not running (Ubuntu) | `sudo systemctl start mongod` |
| Port 5000 in use | Change `PORT=5001` in `.env`, restart server |
| `npm` not found | Reinstall Node.js, ensure it's in PATH |
| PowerShell blocks scripts | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Login works but no data | Run `cd server && npm run seed` to populate demo data |
| "Pending Approval" after signup | Login as admin, go to Users tab, activate the user |

---

## Demo Credentials

After running `npm run seed`:

| Role   | Email            | Password    |
|--------|------------------|-------------|
| Admin  | admin@test.com   | password123 |
| Member | alice@test.com   | password123 |
| Member | bob@test.com     | password123 |
