const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getMarketingSubs,
  getMarketingSub,
  createMarketingSub,
  deleteMarketingSub,
} = require("../controller/marketingSubs");

const router = express.Router();

//"/api/v1/books"
router.route("/").get(getMarketingSubs).post(createMarketingSub);

router.route("/:id").get(getMarketingSub).delete(deleteMarketingSub);

module.exports = router;
