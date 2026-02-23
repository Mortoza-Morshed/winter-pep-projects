# Employee Leave Management System (ELMS) – Full Stack Project

## Project Overview
Build a production-grade, full-stack Employee Leave Management System that simulates a real company HR workflow. Employees can request leave, managers approve/reject requests, and admins manage users and permissions.

---

## UI Design Reference & Style Guide

Design the UI to closely match the following aesthetic:
- **Color Palette**: Primary blue #2563EB, white backgrounds, light gray (#F3F4F6) page backgrounds, dark text (#111827), subtle card shadows
- **Typography**: Clean sans-serif (e.g., Inter or DM Sans), bold stat numbers, muted secondary labels
- **Layout**: Fixed left sidebar (240px) with logo + nav links + user profile at bottom. Main content area with top bar (breadcrumb + action buttons). Cards with rounded corners (border-radius: 12px), subtle borders (#E5E7EB)
- **Components**:
  - Stat cards: white background, colored icon in soft-colored circle, percentage badge (green for positive, red for negative), large bold number, label below
  - Tables: clean rows with avatar + name + ID stacked, email column, role dropdown (styled select), action buttons
  - Status badges: pill-shaped — green for Approved, yellow/orange for Pending, red for Rejected
  - Leave type badges: soft pastel background pills (blue for Annual Leave, pink for Sick Leave, gray for Personal)
  - Sidebar nav: icon + label, active state = full-width blue highlight with white text
  - Action buttons: solid blue (#2563EB) with white text, rounded, "+ Apply Leave" style
  - Pagination: numbered buttons, current page = blue fill

### Pages to Build (with exact layout descriptions):

#### 1. Login Page
- Split layout: left panel (blue #2563EB background with grid texture overlay, logo top-left, large bold app title "Employee Leave Management System", subtitle description, quick tip card at bottom), right panel (white, "Welcome Back" heading, subtitle, email + password fields with icons, "Remember me" checkbox, full-width blue Sign In button, "Register Here" link, copyright footer)

#### 2. Employee Dashboard (LeaveFlow – Employee Portal)
- Sidebar: Dashboard (active), Apply Leave, Leave History; user avatar + name + role at bottom with gear icon
- Top bar: "Employee Dashboard" heading + bell icon + "+ Apply Leave" button
- 3 stat cards: Pending Leaves (orange icon), Approved Leaves (green check icon), Leave Balance in Days (blue icon)
- Leave History table: columns — Leave Type (bold), From Date, To Date, Reason, Status (badge); pagination; "View All" link
- Public Holiday banner at bottom: date badge + holiday name + description + "View Holiday Calendar" link

#### 3. Admin Panel – User Management (LeaveAdmin – Management Portal)
- Sidebar: Dashboard, User Management (active, blue highlight), Leave Requests, Reports, Settings; Super Admin user at bottom with logout icon
- Breadcrumb: Admin > User Management
- Top bar: Search users input + "+ Add User" blue button
- 3 stat cards: Total Users (+12% green), Active Employees (+5% green), Pending Approvals (-8% red)
- User Directory table: Name + avatar + ID, Email, Role (dropdown selector: Admin/Manager/Employee), Actions column; filter icon + download icon top-right of table; pagination showing "1 to 4 of 1,250 users"

#### 4. Manager/Admin – Leave Approvals (LeaveFlow – Admin Console)
- Sidebar: Dashboard, Approvals (active), Team Directory, Reports; Settings section with Configuration; Dept Manager user at bottom
- Page heading: "Leave Approvals" + subtitle "Review and manage pending employee leave requests."
- Top bar: Export button (outline) + "Apply for Leave" blue button
- 3 stat cards: Pending Requests (+2 from last week), On Leave Today (X out of 28 total staff), Team Capacity % (with trend)
- Tabs: Pending (12) | Approved | Rejected | All History
- Leave request table: Employee (avatar + name + role), Leave Type (badge), Duration (date range + X days), Reason, Status (Pending badge), Actions (X dismiss button + blue Approve button)
- Pagination: Previous / Next buttons

---

## Mandatory Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js with Tailwind CSS |
| Routing | React Router v6 (mandatory) |
| State Management | Context API (mandatory) |
| Backend | Node.js with Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT (JSON Web Token) |
| Authorization | Role-Based Access Control (Admin, Manager, Employee) |

---

## Folder Structure

### Frontend (`client/`)

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/         # Sidebar, Navbar, StatCard, Badge, Avatar, Button, Table
│   │   ├── auth/           # LoginForm, RegisterForm, ProtectedRoute
│   │   ├── employee/       # LeaveHistoryTable, ApplyLeaveForm, LeaveBalanceCard
│   │   ├── manager/        # LeaveApprovalTable, ApprovalActionButtons
│   │   └── admin/          # UserTable, RoleDropdown, UserStatsCards
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state: user, token, role, login(), logout()
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── employee/
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── ApplyLeave.jsx
│   │   │   └── LeaveHistory.jsx
│   │   ├── manager/
│   │   │   └── LeaveApprovals.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       └── UserManagement.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx    # All routes with ProtectedRoute wrappers
│   ├── services/
│   │   └── api.js           # Axios instance with JWT interceptor
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
```

### Backend (`server/`)

```
server/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── leaveController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js    # verifyToken
│   └── roleMiddleware.js    # requireRole('Admin'), requireRole('Manager')
├── models/
│   ├── User.js
│   └── LeaveRequest.js
├── routes/
│   ├── authRoutes.js
│   ├── leaveRoutes.js
│   └── userRoutes.js
├── .env
└── server.js
```

---

## Database Models

### User Model

```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,                          // bcrypt hashed
  role: { type: String, enum: ['Admin', 'Manager', 'Employee'], default: 'Employee' },
  department: String,
  employeeId: String,                        // e.g., EMP-001
  leaveBalance: { type: Number, default: 18 },
  createdAt: Date
}
```

### LeaveRequest Model

```js
{
  employee: { type: ObjectId, ref: 'User' },
  leaveType: { type: String, enum: ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Casual Leave'] },
  fromDate: Date,
  toDate: Date,
  numberOfDays: Number,
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewedBy: { type: ObjectId, ref: 'User' },
  reviewedAt: Date,
  createdAt: Date
}
```

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login, return JWT token | Public |

### Leave Routes — `/api/leaves`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/my` | Get own leave requests | Employee |
| POST | `/apply` | Submit new leave request | Employee |
| GET | `/all` | Get all leave requests | Manager / Admin |
| PUT | `/:id/approve` | Approve a request | Manager / Admin |
| PUT | `/:id/reject` | Reject a request | Manager / Admin |
| GET | `/stats` | Get leave balance summary | Employee |

### User Routes — `/api/users`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all users with pagination | Admin |
| PUT | `/:id/role` | Update user role | Admin |
| DELETE | `/:id` | Delete user | Admin |
| GET | `/stats` | Total users, active employees, pending approvals | Admin |

---

## Frontend Route Structure

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Employee Routes */}
  <Route path="/dashboard" element={<ProtectedRoute role="Employee"><EmployeeDashboard /></ProtectedRoute>} />
  <Route path="/apply-leave" element={<ProtectedRoute role="Employee"><ApplyLeave /></ProtectedRoute>} />
  <Route path="/leave-history" element={<ProtectedRoute role="Employee"><LeaveHistory /></ProtectedRoute>} />

  {/* Manager Routes */}
  <Route path="/approvals" element={<ProtectedRoute role="Manager"><LeaveApprovals /></ProtectedRoute>} />

  {/* Admin Routes */}
  <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
  <Route path="/admin/users" element={<ProtectedRoute role="Admin"><UserManagement /></ProtectedRoute>} />
</Routes>
```

> **ProtectedRoute logic**: Check AuthContext for token → redirect to `/login` if unauthenticated → check role → redirect to correct dashboard if role mismatch.

**Post-login redirect by role:**
- Admin → `/admin`
- Manager → `/approvals`
- Employee → `/dashboard`

---

## Context API — AuthContext

```jsx
// Provide globally:
//   - user (object), token (string), role (string), isLoading (bool)
// Methods:
//   - login(email, password) — calls API, stores token, sets user
//   - logout() — clears localStorage, resets state
//   - updateUser(data) — patch user details in context
// Persistence:
//   - Store token in localStorage on login
//   - Rehydrate on app load from localStorage
// Axios interceptor:
//   - Attach Authorization: Bearer <token> to all outgoing requests automatically
```

---

## Core Functional Requirements Checklist

- [x] JWT Authentication (login + register)
- [x] Role-based dashboards (Employee / Manager / Admin see different UIs and routes)
- [x] Apply Leave form with validation (dates, leave type, reason — required fields)
- [x] Leave approval workflow (Manager approves/rejects with one click)
- [x] Status tracking with color badges (Pending / Approved / Rejected)
- [x] Protected routes on frontend and backend
- [x] Backend authorization middleware (verifyToken + requireRole)
- [x] Global auth state via Context API
- [x] Leave balance deduction on approval
- [x] Pagination on all tables

---

## Optional Enhancements (Bonus)

- Chart.js analytics on Admin dashboard (leave type distribution pie chart, monthly leave trends bar chart)
- Toast notifications via `react-hot-toast` on approve / reject / submit actions
- Fully responsive design (mobile sidebar collapses to a drawer)
- Search + filter on User Management table
- Export leave data as CSV

---

## Environment Variables (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/elms
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

---

## Important Implementation Notes

1. Use `bcryptjs` to hash passwords before saving to the database
2. Return only necessary fields from API responses — never expose the `password` field
3. All API errors must return structured JSON: `{ success: false, message: "..." }`
4. Use loading states (spinner or skeleton) in React while fetching data
5. Show inline error messages below form fields on validation failure
6. Tailwind CSS only — no external UI component library unless specified
7. All reusable components must accept and use props cleanly
8. README must include: setup instructions, `.env` setup guide, test credentials for each role, and screenshots

---

## Seed Script (`server/seed.js`)

Create a seed script that populates the database with:

| Role | Email | Password |
|---|---|---|
| Admin | admin@company.com | Admin@123 |
| Manager | manager@company.com | Manager@123 |
| Employee | emp1@company.com | Emp@123 |
| Employee | emp2@company.com | Emp@123 |
| Employee | emp3@company.com | Emp@123 |

Also seed 8–10 sample leave requests across all statuses (Pending, Approved, Rejected) for realistic testing.

---

## Grading Rubric Reference

| Criteria | Marks |
|---|---|
| Authentication & Security Implementation | 20 |
| Role-Based Authorization Logic | 20 |
| Frontend UI (Tailwind + Routing + Context API) | 15 |
| Backend API Structure & Middleware | 15 |
| Database Design (MongoDB) | 10 |
| Code Quality & Folder Structure | 10 |
| README & Documentation | 5 |
| Bonus Features / Innovation | 5 |
| **Total** | **100** |

---

> Build this as a complete, production-ready project. All pages must be fully functional with real API integration. No placeholder or mock data in the final build except within the seed script.
