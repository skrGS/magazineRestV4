const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getHighlightCats,
  getHighlightCat,
  createHighlightCat,
  updateHighlightCat,
  deleteHighlightCat,
} = require("../controller/highlightCats");

// api/v1/HighlightCats/:id/Highlights
const { getHighlightCatHighlights } = require("../controller/highlights");
router.route("/:highlightCatId/highlights").get(getHighlightCatHighlights);

//"/api/v1/HighlightCats"
router
  .route("/")
  .get(getHighlightCats)
  .post(protect, authorize("admin"), createHighlightCat);

router
  .route("/:id")
  .get(getHighlightCat)
  .put(protect, authorize("admin", "operator"), updateHighlightCat)
  .delete(protect, authorize("admin"), deleteHighlightCat);

module.exports = router;
