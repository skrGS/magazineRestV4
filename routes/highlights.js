const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getHighlights,
  getHighlight,
  createHighlight,
  deleteHighlight,
  updateHighlight,
  uploadHighlightPhoto,
} = require("../controller/highlights");

const router = express.Router();

//"/api/v1/Highlight"
router
  .route("/")
  .get(getHighlights)
  .post(protect, authorize("admin", "operator"), createHighlight);

router
  .route("/:id")
  .get(getHighlight)
  .delete(protect, authorize("admin", "operator"), deleteHighlight)
  .put(protect, authorize("admin", "operator"), updateHighlight);

router.route("/:id/upload-photo").put(uploadHighlightPhoto);

module.exports = router;
