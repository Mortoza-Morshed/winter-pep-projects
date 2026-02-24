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
    const claim = await Reimbursement.create({
      employee: req.user._id,
      title,
      category,
      amount,
      date,
      description,
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
    const claims = await Reimbursement.find({})
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
      status: "Pending",
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
    const claim = await Reimbursement.findById(req.params.id);
    if (!claim) return res.status(404).json({ success: false, message: "Claim not found" });
    if (claim.status !== "Pending")
      return res.status(400).json({ success: false, message: "Claim already processed" });

    claim.status = "Approved";
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = Date.now();
    claim.comments = req.body.comments || "";
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
    const claim = await Reimbursement.findById(req.params.id);
    if (!claim) return res.status(404).json({ success: false, message: "Claim not found" });
    if (claim.status !== "Pending")
      return res.status(400).json({ success: false, message: "Claim already processed" });

    claim.status = "Rejected";
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = Date.now();
    claim.comments = req.body.comments || "";
    await claim.save();

    res.json({ success: true, claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitClaim, getMyClaims, getAllClaims, getStats, approveClaim, rejectClaim };
