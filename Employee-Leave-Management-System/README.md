# Employee Leave Management System (ELMS)

A modern, full-stack application for managing employee leave requests, featuring a React frontend and a Node.js/Express/MongoDB backend.

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Distinct views for Employees, Managers, and Admins.
- **Leave Management**: Apply for leave, track history, and manage approvals.
- **Admin Dashboard**: Comprehensive user directory and role management.
- **Modern UI**: Built with Tailwind CSS v4 and Lucide icons for a professional look.
- **Authentication**: Secure JWT-based auth with auto-login and session persistence.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), React Router v6, Tailwind CSS v4, Context API, Axios, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcryptjs.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup

```bash
cd server
npm install
```

Configure `.env` in `client/server`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/elms
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

Populate initial data:

```bash
npm run seed
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install --legacy-peer-deps
npm run dev
```

## 🔐 Test Credentials (Seeded)

The `npm run seed` command provides the following accounts:

| Role         | Email               | Password    |
| :----------- | :------------------ | :---------- |
| **Admin**    | admin@company.com   | Admin@123   |
| **Manager**  | manager@company.com | Manager@123 |
| **Employee** | emp1@company.com    | Emp@123     |

## 📂 Project Structure

- `/server`: API logic, models, and middleware.
- `/client`: React source code, components, and styling.
- `/brain`: Documentation and implementation artifacts.

---

Developed as part of the Winter PEP project suite.
