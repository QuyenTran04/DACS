const express = require("express");
const Booking = require("../controllers/booking");
const router = express.Router();
const role = require("../middlewares/authMiddleware");

router.post("/", role.authenticateToken, Booking.createBooking);
router.get("/History", role.authenticateToken, Booking.getBookingHistory);
module.exports = router;