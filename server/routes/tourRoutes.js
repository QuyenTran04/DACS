const express = require("express");
const Tour = require("../controllers/tour");
const router = express.Router();
const role = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post(
  "/createTour",
  Tour.createTour
);
router.get(
  "/getTourByProvider",
  role.authenticateToken,
  role.authorizeRole(["provider", "admin"]),
  Tour.getToursByProvider
);
router.put(
  "/updateTour",
  role.authenticateToken,
  role.authorizeRole(["provider", "admin"]),
  Tour.updateTour
);

router.delete(
  "/deleteTour",
  role.authenticateToken,
  role.authorizeRole(["provider", "admin"]),
  Tour.deleteTour
);

router.put("/findTour", role.authenticateToken, Tour.getToursByLocation);
router.get("/listTour", Tour.getListTour);
router.get("/getTour/:id", Tour.getTour);
module.exports = router;

