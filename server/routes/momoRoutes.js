const express = require("express");
const router = express.Router();
const momoController = require("../controllers/momo");

router.post("/create", momoController.createMomoPayment);
router.post("/ipn", momoController.momoIpn);

module.exports = router;
