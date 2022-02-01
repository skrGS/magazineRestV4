const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getWork,
  getWorks,
  createWork,
  deleteWork,
  updateWork,
  uploadWorkPhoto,
} = require("../controller/works");

const router = express.Router();

//"/api/v1/works"
router
  .route("/")
  .get(getWorks)
  .post(protect, authorize("admin", "operator"), createWork);

router
  .route("/:id")
  .get(getWork)
  .delete(protect, authorize("admin", "operator"), deleteWork)
  .put(protect, authorize("admin", "operator"), updateWork);

router.route("/:id/upload-photo").put(uploadWorkPhoto);

module.exports = router;
