const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/momo-ipn", paymentController.handleMomoIPN);

module.exports = router;
