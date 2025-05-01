const express = require("express");
const User = require("../controllers/profile");
const router = express.Router();
const role = require("../middlewares/authMiddleware");

router.post("/", role.authenticateToken,User.createProfile);

module.exports = router;
