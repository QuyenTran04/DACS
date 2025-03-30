const express = require("express");
const User = require("../controllers/authController");
const role = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register",role.authenticateToken,role.authorizeRole(["admin","user"]), User.registerUser);
router.post("/login", User.loginUser);

module.exports = router;
