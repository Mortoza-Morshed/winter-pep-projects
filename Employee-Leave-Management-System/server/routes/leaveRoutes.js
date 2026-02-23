const express = require("express");
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getLeaveStats,
} = require("../controllers/leaveController");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();

router.use(verifyToken);

router.post("/apply", authorizeRoles("Employee"), applyLeave);
router.get("/my", authorizeRoles("Employee"), getMyLeaves);
router.get("/stats", authorizeRoles("Employee"), getLeaveStats);

router.get("/all", authorizeRoles("Manager", "Admin"), getAllLeaves);
router.put("/:id/approve", authorizeRoles("Manager", "Admin"), approveLeave);
router.put("/:id/reject", authorizeRoles("Manager", "Admin"), rejectLeave);

module.exports = router;
