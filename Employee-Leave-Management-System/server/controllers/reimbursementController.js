const Reimbursement = require("../models/Reimbursement");

// @desc    Submit a new reimbursement claim
// @route   POST /api/reimbursements/submit
// @access  Private/Employee
const submitClaim = async (req, res) => {
  const { title, category, amount, date, description } = req.body;

  if (!title || !category || !amount || !date) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide title, category, amount, and date." });
  }

  try {
    // If a Manager submits, auto-advance to 'Manager Approved' so Admin can review directly
    const initialStatus = req.user.role === "Manager" ? "Manager Approved" : "Pending";

    const claim = await Reimbursement.create({
      employee: req.user._id,
      title,
      category,
      amount,
      date,
      description,
      status: initialStatus,
    });
    res.status(201).json({ success: true, claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get own reimbursement claims
// @route   GET /api/reimbursements/my
// @access  Private/Employee
const getMyClaims = async (req, res) => {
  try {
    const claims = await Reimbursement.find({ employee: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reimbursement claims
// @route   GET /api/reimbursements/all
// @access  Private/Manager or Admin
const getAllClaims = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "Manager") {
      // Managers see Pending claims from Employees only (not their own Manager-submitted claims)
      filter = {
        status: { $in: ["Pending", "Approved", "Rejected"] },
        employeeRole: { $ne: "Manager" },
      };
      // Use a lookup-style approach: find claims where employee is NOT a Manager
      const User = require("../models/User");
      const employees = await User.find({ role: "Employee" }).select("_id");
      const employeeIds = employees.map((u) => u._id);
      filter = {
        status: { $in: ["Pending", "Manager Approved", "Approved", "Rejected"] },
        employee: { $in: employeeIds },
      };
    } else if (req.user.role === "Admin") {
      filter = { status: { $in: ["Manager Approved", "Approved", "Rejected"] } };
    }

    const claims = await Reimbursement.find(filter)
      .populate("employee", "name email role employeeId department")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get claim stats for current employee
// @route   GET /api/reimbursements/stats
// @access  Private/Employee
const getStats = async (req, res) => {
  try {
    const total = await Reimbursement.countDocuments({ employee: req.user._id });
    const pending = await Reimbursement.countDocuments({
      employee: req.user._id,
      status: { $in: ["Pending", "Manager Approved"] },
    });
    const approved = await Reimbursement.countDocuments({
      employee: req.user._id,
      status: "Approved",
    });
    const rejected = await Reimbursement.countDocuments({
      employee: req.user._id,
      status: "Rejected",
    });

    // Total approved amount
    const approvedClaims = await Reimbursement.find({ employee: req.user._id, status: "Approved" });
    const totalApprovedAmount = approvedClaims.reduce((sum, c) => sum + c.amount, 0);

    res.json({ success: true, total, pending, approved, rejected, totalApprovedAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve a claim
// @route   PUT /api/reimbursements/:id/approve
// @access  Private/Manager or Admin
const approveClaim = async (req, res) => {
  try {
    const claim = await Reimbursement.findById(req.params.id).populate("employee", "role");
    if (!claim) return res.status(404).json({ success: false, message: "Claim not found" });

    // Managers cannot approve another Manager's reimbursement
    if (req.user.role === "Manager" && claim.employee?.role === "Manager") {
      return res.status(403).json({
        success: false,
        message: "Managers cannot approve other Managers' reimbursement claims",
      });
    }

    if (req.user.role === "Manager") {
      if (claim.status !== "Pending")
        return res.status(400).json({
          success: false,
          message: "Claim already processed by Manager or invalid status",
        });

      claim.status = "Manager Approved";
      claim.reviewedBy = req.user._id;
      claim.reviewedAt = Date.now();
      claim.comments = req.body?.comments || "";
    } else if (req.user.role === "Admin") {
      if (claim.status !== "Manager Approved")
        return res
          .status(400)
          .json({ success: false, message: "Claim must be Manager Approved first" });

      claim.status = "Approved";
      claim.reviewedBy = req.user._id;
      claim.reviewedAt = Date.now();
      if (req.body?.comments) {
        claim.comments = claim.comments
          ? `${claim.comments} | Admin: ${req.body.comments}`
          : req.body.comments;
      }
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized role for approval" });
    }

    await claim.save();

    res.json({ success: true, claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject a claim
// @route   PUT /api/reimbursements/:id/reject
// @access  Private/Manager or Admin
const rejectClaim = async (req, res) => {
  try {
    const claim = await Reimbursement.findById(req.params.id).populate("employee", "role");
    if (!claim) return res.status(404).json({ success: false, message: "Claim not found" });

    // Managers cannot reject another Manager's reimbursement
    if (req.user.role === "Manager" && claim.employee?.role === "Manager") {
      return res.status(403).json({
        success: false,
        message: "Managers cannot reject other Managers' reimbursement claims",
      });
    }

    // Managers can reject Pending. Admins can reject Manager Approved.
    if (req.user.role === "Manager" && claim.status !== "Pending") {
      return res
        .status(400)
        .json({ success: false, message: "Manager can only reject Pending claims" });
    }
    if (req.user.role === "Admin" && claim.status !== "Manager Approved") {
      return res
        .status(400)
        .json({ success: false, message: "Admin can only reject Manager Approved claims" });
    }

    claim.status = "Rejected";
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = Date.now();
    if (req.body?.comments && req.user.role === "Admin") {
      claim.comments = claim.comments
        ? `${claim.comments} | Admin: ${req.body.comments}`
        : req.body.comments;
    } else {
      claim.comments = req.body?.comments || "";
    }
    await claim.save();

    res.json({ success: true, claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitClaim, getMyClaims, getAllClaims, getStats, approveClaim, rejectClaim };
