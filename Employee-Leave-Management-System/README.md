# Luna

A modern, full-stack employee leave and expense management system. Built with a React (Vite) frontend and a Node.js/Express/MongoDB backend, featuring role-based access control for Employees, Managers, and Admins.

---

## Key Features

- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for Employees, Managers, and Admins.
- **Leave Management**: Employees can apply for leaves, view their history, and track their available balance (defaults to 30 days). Managers and Admins can approve or reject requests.
- **Expense Reimbursements**: Employees can submit claims for meals, equipment, travel, and more. Managers and Admins can approve or reject them.
- **Admin Controls**: Full user directory, role management, system-wide leave approvals, and visual analytics via the Reports page.
- **Notifications**: Real-time in-app notification context for status updates on leave and reimbursement requests.
- **Mobile-Responsive Layout**: Pinned sidebar on desktop that converts to a slide-in drawer on mobile, triggered by a hamburger menu.
- **Modern UI**: Built with Tailwind CSS v4, Lucide React icons, and a clean dark-themed aesthetic.
- **Authentication**: Secure JWT-based auth with session persistence via `localStorage`.

---

## Technology Stack

| Layer      | Technology                                                                 |
| :--------- | :------------------------------------------------------------------------- |
| Frontend   | React 19 (Vite), React Router v7, Tailwind CSS v4, Context API, Axios       |
| UI / Icons | Lucide React, React Hot Toast, Chart.js                                    |
| Backend    | Node.js, Express v5                                                        |
| Database   | MongoDB (Mongoose ODM)                                                     |
| Auth       | JSON Web Tokens (JWT), Bcryptjs                                             |
| Dev Tools  | Nodemon, dotenv                                                             |

---

## Project Structure

```
Employee-Leave-Management-System/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── components/         # Reusable UI components (Layout, Sidebar, etc.)
│       ├── context/            # AuthContext, NotificationsContext
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── employee/       # Dashboard, ApplyLeave, LeaveHistory, ReimbursementForm, ReimbursementHistory
│       │   ├── manager/        # Dashboard, LeaveApprovals, ReimbursementApprovals
│       │   └── admin/          # Dashboard, UserManagement, AdminLeaveApprovals, Reports
│       ├── routes/             # Protected route components
│       ├── services/           # Axios API service modules
│       └── utils/              # Helper utilities
└── server/                     # Node.js/Express backend
    ├── config/                 # Database connection
    ├── controllers/            # Route handler logic
    ├── middleware/             # Auth & role middleware
    ├── models/                 # Mongoose schemas (User, LeaveRequest, Reimbursement)
    ├── routes/                 # API routes (auth, leave, reimbursement, user)
    ├── seed.js                 # Database seeder
    └── server.js               # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/elms
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Seed the database, then start the dev server:

```bash
npm run seed
npm run dev
```

> The server will run on **http://localhost:5000**.

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

> The client will run on **http://localhost:5173**.

---

## API Endpoints

| Method | Endpoint                            | Access         | Description                       |
| :----- | :---------------------------------- | :------------- | :-------------------------------- |
| POST   | `/api/auth/login`                   | Public         | User login                        |
| POST   | `/api/auth/register`                | Public         | Register new employee             |
| GET    | `/api/leaves`                       | Employee+      | Get leave requests                |
| POST   | `/api/leaves`                       | Employee       | Submit a new leave request        |
| PUT    | `/api/leaves/:id/status`            | Manager, Admin | Approve or reject a leave         |
| GET    | `/api/reimbursements`               | Employee+      | Get reimbursement claims          |
| POST   | `/api/reimbursements`               | Employee       | Submit a reimbursement claim      |
| PUT    | `/api/reimbursements/:id/status`    | Manager, Admin | Approve or reject a reimbursement |
| GET    | `/api/users`                        | Admin          | List all users                    |
| PUT    | `/api/users/:id/role`               | Admin          | Update a user's role              |

---

## Test Credentials (Seeded)

Run `npm run seed` in the `server/` directory to populate the database with the following test accounts:

| Role         | Name          | Email               | Password    |
| :----------- | :------------ | :------------------ | :---------- |
| **Admin**    | System Admin  | admin@company.com   | Admin@123   |
| **Manager**  | Jane Manager  | manager@company.com | Manager@123 |
| **Employee** | John Employee | emp1@company.com    | Emp@123     |
| **Employee** | Alice Smith   | emp2@company.com    | Emp@123     |

---

## Available Scripts

### Server (`/server`)

| Command         | Description                          |
| :-------------- | :----------------------------------- |
| `npm run dev`   | Start backend with Nodemon (hot reload) |
| `npm start`     | Start backend with Node              |
| `npm run seed`  | Seed the database with test data     |

### Client (`/client`)

| Command         | Description                       |
| :-------------- | :-------------------------------- |
| `npm run dev`   | Start Vite dev server             |
| `npm run build` | Build for production              |
| `npm run preview` | Preview production build        |
