const express = require("express");
const User = require("../controllers/authController");
const router = express.Router();


router.post("/register", User.registerUser);
router.post("/login",User.loginUser);

module.exports = router;
