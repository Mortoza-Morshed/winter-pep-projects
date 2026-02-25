# Recharge 

A modern, full-stack application for managing employee leave requests and expense reimbursements. Featuring a beautiful, responsive React frontend and a Node.js/Express/MongoDB backend.

## Key Features

- **Role-Based Access Control (RBAC)**: Distinct views for Employees, Managers, and Admins.
- **Leave Management**: Apply for leaves, view your history, and see your accurate available balance (defaults to 30 days). Managers can approve or reject leaves.
- **Expense Reimbursements**: Employees can submit claims for meals, equipment, travel, etc. Managers and Admins can approve or reject them.
- **Mobile Responsive Layout**: Includes a pinned desktop sidebar that seamlessly converts to a slide-in drawer on mobile devices, triggered by a hamburger menu.
- **Admin Dashboard**: Comprehensive user directory and role management with visual reports and system analytics.
- **Modern UI**: Built with Tailwind CSS v4 and Lucide icons for a clean, professional, and dark-themed aesthetics.
- **Authentication**: Secure JWT-based auth with auto-login and session persistence.

## Technology Stack

- **Frontend**: React (Vite), React Router v6, Tailwind CSS v4, Context API, Axios, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcryptjs.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup

```bash
cd server
npm install
```

Configure `.env` in `server`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/elms
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
```

Populate initial data (users, leaves, and reimbursements):

```bash
node seed.js
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Test Credentials (Seeded)

Running `node seed.js` in the server directory provides the following pre-populated test accounts:

| Role         | Name          | Email               | Password    |
| :----------- | :------------ | :------------------ | :---------- |
| **Admin**    | System Admin  | admin@company.com   | Admin@123   |
| **Manager**  | Jane Manager  | manager@company.com | Manager@123 |
| **Employee** | John Employee | emp1@company.com    | Emp@123     |
| **Employee** | Alice Smith   | emp2@company.com    | Emp@123     |

## Project Structure

- `/server`: API logic, models, controllers, and middleware.
- `/client`: React source code, context, components, and pages.

---

