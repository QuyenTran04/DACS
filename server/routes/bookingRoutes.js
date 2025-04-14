const express = require("express");
const Booking = require("../controllers/booking");
const router = express.Router();
const role = require("../middlewares/authMiddleware");

router.post("/booking", role.authenticateToken, Booking.createBookingWithMomo);

module.exports = router;