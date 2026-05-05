# Installation Guide — TaskFlow

Step-by-step installation guide for Mac, Windows, and Ubuntu.

---

## Table of Contents

1. [Mac Installation](#mac-installation)
2. [Windows Installation](#windows-installation)
3. [Ubuntu Installation](#ubuntu-installation)
4. [Project Setup (All Platforms)](#project-setup-all-platforms)
5. [Running the Application](#running-the-application)
6. [Verifying Everything Works](#verifying-everything-works)
7. [Common Issues & Fixes](#common-issues--fixes)

---

## Mac Installation

### Step 1: Install Homebrew (if not installed)

Open **Terminal** (`Cmd + Space` → type "Terminal" → Enter):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Node.js

```bash
brew install node
```

Verify:

```bash
node --version    # should show v18+ or v20+
npm --version     # should show v9+
```

### Step 3: Install MongoDB

```bash
brew tap mongodb/brew
brew install mongodb-community
```

Start MongoDB:

```bash
brew services start mongodb-community
```

Verify:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

Expected output: `{ ok: 1 }`

### Step 4: Install Git (if not installed)

```bash
brew install git
```

Verify:

```bash
git --version
```

**Mac setup is complete. Go to [Project Setup](#project-setup-all-platforms).**

---

## Windows Installation

### Step 1: Install Node.js

1. Go to **https://nodejs.org**
2. Click the **LTS** download button
3. Run the downloaded `.msi` installer
4. **Important:** Check the box **"Add to PATH"** during installation
5. Click through the installer (Next → Next → Install → Finish)

Open **Command Prompt** (`Win + R` → type `cmd` → Enter) and verify:

```bash
node --version    # should show v18+ or v20+
npm --version     # should show v9+
```

### Step 2: Install MongoDB

1. Go to **https://www.mongodb.com/try/download/community**
2. Select:
   - **Version:** Latest (7.x)
   - **Platform:** Windows
   - **Package:** MSI
3. Click **Download**
4. Run the downloaded `.msi` installer
5. Select **"Complete"** setup type
6. **Important:** Check **"Install MongoDB as a Service"**
   - This makes MongoDB start automatically with Windows
   - Service Name: `MongoDB`
   - Data Directory: default is fine
7. **Optional:** Check "Install MongoDB Compass" (GUI tool)
8. Click Install → Finish

Verify MongoDB is running:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

If `mongosh` is not found, add it to PATH:

1. Open **Start Menu** → Search **"Environment Variables"**
2. Click **"Edit the system environment variables"**
3. Click **"Environment Variables"** button
4. Under **System Variables**, find **Path** → Click **Edit**
5. Click **New** → Add: `C:\Program Files\MongoDB\Server\7.0\bin`
6. Click OK on all dialogs
7. **Close and reopen** Command Prompt
8. Try `mongosh` again

### Step 3: Install Git

1. Go to **https://git-scm.com/download/win**
2. Download will start automatically
3. Run the installer with default settings
4. Verify:

```bash
git --version
```

### Step 4: PowerShell Configuration (Optional)

If using PowerShell and scripts are blocked:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Type `Y` and press Enter to confirm.

**Windows setup is complete. Go to [Project Setup](#project-setup-all-platforms).**

---

## Ubuntu Installation

### Step 1: Update System

Open **Terminal** (`Ctrl + Alt + T`):

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node --version    # should show v20.x
npm --version     # should show v9+
```

### Step 3: Install MongoDB

```bash
# Install required tools
sudo apt install -y gnupg curl

# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org
```

Start MongoDB and enable on boot:

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

Verify:

```bash
sudo systemctl status mongod          # should say "active (running)"
mongosh --eval "db.runCommand({ ping: 1 })"   # should show { ok: 1 }
```

### Step 4: Install Git (if not installed)

```bash
sudo apt install -y git
```

Verify:

```bash
git --version
```

**Ubuntu setup is complete. Go to [Project Setup](#project-setup-all-platforms).**

---

## Project Setup (All Platforms)

These steps are **the same** on Mac, Windows, and Ubuntu.

### Step 1: Get the Project

**Option A — Clone from GitHub:**

```bash
git clone <repo-url>
cd boy
```

**Option B — Download ZIP:**

1. Go to the GitHub repo page
2. Click **Code** → **Download ZIP**
3. Extract the ZIP file
4. Open terminal and navigate to the extracted folder

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

Expected output:

```
added 138 packages, and audited 139 packages
found 0 vulnerabilities
```

### Step 3: Install Client Dependencies

```bash
cd ../client
npm install
```

Expected output:

```
added 218 packages, and audited 219 packages
found 0 vulnerabilities
```

### Step 4: Configure Environment

Go back to project root:

```bash
cd ..
```

**Mac / Ubuntu:**

```bash
cp server/.env.example server/.env
```

**Windows:**

```bash
copy server\.env.example server\.env
```

The default `.env` file works with local MongoDB — no changes needed:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=team-task-manager-secret-key-2024
NODE_ENV=development
```

### Step 5: Seed Demo Data (Recommended)

```bash
cd server
npm run seed
```

Expected output:

```
Connected to MongoDB
Cleared existing data
Created users
Created projects
Created tasks

--- Seed Complete ---
Admin:  admin@test.com / password123
Member: alice@test.com / password123
Member: bob@test.com   / password123
```

---

## Running the Application

You need **two terminal windows** running simultaneously.

### Terminal 1 — Start Backend

```bash
cd server
npm run dev
```

Expected output:

```
[nodemon] starting `node server.js`
MongoDB connected
Server running on port 5000
```

Keep this terminal open.

### Terminal 2 — Start Frontend

Open a **new terminal window**, then:

```bash
cd client
npm run dev
```

Expected output:

```
VITE v8.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

Keep this terminal open.

### Open in Browser

Go to: **http://localhost:5173**

You will see the login page.

---

## Verifying Everything Works

### Step 1: Login as Admin

- **Email:** `admin@test.com`
- **Password:** `password123`

### Step 2: Check All Pages

| Page | URL | What You Should See |
|------|-----|---------------------|
| Dashboard | /dashboard | Stats cards, overdue tasks, active tasks |
| Projects | /projects | 2 sample projects with member avatars |
| Tasks | /tasks | 6 tasks with status/priority badges |
| Users | /users | 3 users with role and status controls |

### Step 3: Test Key Features

1. **Create a project:** Projects → "+ New Project" → Fill form → Create
2. **Add a task:** Click a project → "+ Add Task" → Fill form → Create
3. **Change task status:** Click the status dropdown on any task → Select new status
4. **Add a member:** Project detail → "+ Add Member" → Select user → Add
5. **Toggle user status:** Users → Click "Active"/"Inactive" button

### Step 4: Test User Approval Flow

1. Logout → Click "Sign up"
2. Create a new account → You'll see "Pending Approval" screen
3. Login as admin (`admin@test.com`)
4. Go to Users → Find the new user → Click "Inactive" to activate
5. Login as the new user → Now you can access everything

---

## Common Issues & Fixes

### MongoDB Issues

| Issue | Platform | Fix |
|-------|----------|-----|
| `mongosh` command not found | Mac | `brew install mongosh` |
| `mongosh` command not found | Windows | Add `C:\Program Files\MongoDB\Server\7.0\bin` to PATH |
| `mongosh` command not found | Ubuntu | `sudo apt install -y mongosh` |
| MongoDB not running | Mac | `brew services start mongodb-community` |
| MongoDB not running | Windows | Open `services.msc` → Find "MongoDB Server" → Click Start |
| MongoDB not running | Ubuntu | `sudo systemctl start mongod` |
| Connection refused error | All | Make sure MongoDB is running (see above) |

### Node.js Issues

| Issue | Platform | Fix |
|-------|----------|-----|
| `node` not found | Windows | Reinstall Node.js, check "Add to PATH" |
| `npm` permission error | Mac/Ubuntu | Don't use `sudo npm`. Fix ownership: `sudo chown -R $(whoami) ~/.npm` |
| Wrong Node version | All | Install v18+ from nodejs.org |

### Application Issues

| Issue | Fix |
|-------|-----|
| Port 5000 already in use | Change `PORT=5001` in `server/.env`, restart server |
| Port 5173 already in use | Vite auto-picks next port (5174, 5175...) |
| Blank page after login | Check browser console for errors. Make sure backend is running |
| "Pending Approval" after signup | Login as admin → Users → Activate the user |
| No demo data | Run `cd server && npm run seed` |
| API errors in browser | Make sure backend terminal shows "Server running on port 5000" |
| PowerShell blocks npm | Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |

### Stopping the Application

Press `Ctrl + C` in both terminal windows to stop the servers.

### Stopping MongoDB

**Mac:**
```bash
brew services stop mongodb-community
```

**Windows:**

Open `services.msc` → Find "MongoDB Server" → Click Stop

**Ubuntu:**
```bash
sudo systemctl stop mongod
```

---

## Quick Reference

| Command | What It Does |
|---------|-------------|
| `cd server && npm install` | Install backend dependencies |
| `cd client && npm install` | Install frontend dependencies |
| `cd server && npm run seed` | Populate database with demo data |
| `cd server && npm run dev` | Start backend (development mode) |
| `cd client && npm run dev` | Start frontend (development mode) |
| `cd client && npm run build` | Build frontend for production |
| `cd server && npm start` | Start backend (production mode) |

---

## Demo Credentials

| Role   | Email            | Password    |
|--------|------------------|-------------|
| Admin  | admin@test.com   | password123 |
| Member | alice@test.com   | password123 |
| Member | bob@test.com     | password123 |
