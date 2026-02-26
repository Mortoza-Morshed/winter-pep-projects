const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");

// @desc    Submit new leave request
// @route   POST /api/leaves/apply
// @access  Private/Employee
const applyLeave = async (req, res) => {
  const { leaveType, fromDate, toDate, numberOfDays, reason } = req.body;

  if (!leaveType || !fromDate || !toDate || !numberOfDays || !reason) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required leave details" });
  }

  try {
    const leave = await LeaveRequest.create({
      employee: req.user._id,
      leaveType,
      fromDate,
      toDate,
      numberOfDays,
      reason,
    });

    res.status(201).json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get own leave requests
// @route   GET /api/leaves/my
// @access  Private/Employee
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all leave requests
// @route   GET /api/leaves/all
// @access  Private/Manager or Admin
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({})
      .populate("employee", "name email role employeeId")
      .sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve a request
// @route   PUT /api/leaves/:id/approve
// @access  Private/Manager or Admin
const approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id).populate("employee", "role");

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Leave already processed" });
    }

    // Role-based approval guard: Managers approve Employee leaves, Admins approve Manager leaves
    if (req.user.role === "Manager" && leave.employee.role !== "Employee") {
      return res
        .status(403)
        .json({ success: false, message: "Managers can only approve Employee leave requests" });
    }
    if (req.user.role === "Admin" && leave.employee.role !== "Manager") {
      return res
        .status(403)
        .json({ success: false, message: "Admins can only approve Manager leave requests" });
    }

    // NOTE: Leave balance is NOT deducted here directly.
    // It is calculated dynamically in getLeaveStats by summing approved days.
    leave.status = "Approved";
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = Date.now();
    await leave.save();

    res.json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject a request
// @route   PUT /api/leaves/:id/reject
// @access  Private/Manager or Admin
const rejectLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id).populate("employee", "role");

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }

    // Role-based rejection guard
    if (req.user.role === "Manager" && leave.employee.role !== "Employee") {
      return res
        .status(403)
        .json({ success: false, message: "Managers can only reject Employee leave requests" });
    }
    if (req.user.role === "Admin" && leave.employee.role !== "Manager") {
      return res
        .status(403)
        .json({ success: false, message: "Admins can only reject Manager leave requests" });
    }

    leave.status = "Rejected";
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = Date.now();
    await leave.save();

    res.json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get leave balance summary
// @route   GET /api/leaves/stats
// @access  Private/Employee
const getLeaveStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pendingLeaves = await LeaveRequest.countDocuments({
      employee: req.user._id,
      status: "Pending",
    });
    const approvedLeavesCount = await LeaveRequest.countDocuments({
      employee: req.user._id,
      status: "Approved",
    });

    const approvedLeaves = await LeaveRequest.find({
      employee: req.user._id,
      status: "Approved",
    });

    const usedDays = approvedLeaves.reduce((sum, leave) => sum + (leave.numberOfDays || 0), 0);
    const availableBalance = Math.max(0, user.leaveBalance - usedDays);

    res.json({
      success: true,
      leaveBalance: availableBalance, // Send actual remaining balance
      pendingLeaves,
      approvedLeaves: approvedLeavesCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getLeaveStats,
};
