const express = require("express");
const {
  submitClaim,
  getMyClaims,
  getAllClaims,
  getStats,
  approveClaim,
  rejectClaim,
} = require("../controllers/reimbursementController");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(verifyToken);

router.post("/submit", authorizeRoles("Employee"), submitClaim);
router.get("/my", authorizeRoles("Employee"), getMyClaims);
router.get("/stats", authorizeRoles("Employee"), getStats);

router.get("/all", authorizeRoles("Manager", "Admin"), getAllClaims);
router.put("/:id/approve", authorizeRoles("Manager", "Admin"), approveClaim);
router.put("/:id/reject", authorizeRoles("Manager", "Admin"), rejectClaim);

module.exports = router;
