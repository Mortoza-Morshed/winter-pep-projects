const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const LeaveRequest = require("./models/LeaveRequest");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    // Clear existing data
    await User.deleteMany();
    await LeaveRequest.deleteMany();

    // Create Users
    const users = await User.create([
      {
        name: "System Admin",
        email: "admin@company.com",
        password: "Admin@123",
        role: "Admin",
        department: "IT",
        employeeId: "ADM-001",
      },
      {
        name: "Jane Manager",
        email: "manager@company.com",
        password: "Manager@123",
        role: "Manager",
        department: "Operations",
        employeeId: "MGR-001",
      },
      {
        name: "John Employee",
        email: "emp1@company.com",
        password: "Emp@123",
        role: "Employee",
        department: "Sales",
        employeeId: "EMP-001",
        leaveBalance: 18,
      },
      {
        name: "Alice Smith",
        email: "emp2@company.com",
        password: "Emp@123",
        role: "Employee",
        department: "Marketing",
        employeeId: "EMP-002",
        leaveBalance: 18,
      },
    ]);

    console.log("Users Seeded!");

    // Create Sample Leave Requests
    const emp1 = users.find((u) => u.email === "emp1@company.com");
    const emp2 = users.find((u) => u.email === "emp2@company.com");
    const mgr = users.find((u) => u.role === "Manager");

    await LeaveRequest.create([
      {
        employee: emp1._id,
        leaveType: "Annual Leave",
        fromDate: new Date("2024-03-01"),
        toDate: new Date("2024-03-05"),
        numberOfDays: 5,
        reason: "Family vacation",
        status: "Approved",
        reviewedBy: mgr._id,
        reviewedAt: new Date(),
      },
      {
        employee: emp2._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2024-03-10"),
        toDate: new Date("2024-03-11"),
        numberOfDays: 2,
        reason: "Flu",
        status: "Pending",
      },
      {
        employee: emp1._id,
        leaveType: "Personal Leave",
        fromDate: new Date("2024-03-15"),
        toDate: new Date("2024-03-15"),
        numberOfDays: 1,
        reason: "Urgent work at home",
        status: "Rejected",
        reviewedBy: mgr._id,
        reviewedAt: new Date(),
      },
    ]);

    console.log("Leave Requests Seeded!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
