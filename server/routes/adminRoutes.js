const express = require("express");
const Admin = require("../controllers/admin");
const router = express.Router();
const role = require("../middlewares/authMiddleware");

router.get(
  "/accounts",
  role.authenticateToken,
  role.authorizeRole(["admin"]),
  Admin.listUser
);
router.put(
  "/accounts/:id",
  role.authenticateToken,
  role.authorizeRole(["admin"]),
  Admin.updateUser
);
router.delete(
  "/accounts/:id",
  role.authenticateToken,
  role.authorizeRole(["admin"]),
  Admin.deleteUser
);
module.exports = router;

