const express = require("express");
const {
  getUsers,
  updateUserRole,
  deleteUser,
  getUserStats,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();

router.use(verifyToken);

router.get("/", authorizeRoles("Admin"), getUsers);
router.get("/stats", authorizeRoles("Admin"), getUserStats);
router.put("/:id/role", authorizeRoles("Admin"), updateUserRole);
router.delete("/:id", authorizeRoles("Admin"), deleteUser);

module.exports = router;
