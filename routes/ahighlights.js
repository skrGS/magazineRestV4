const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getAhighlight,
  getAhighlights,
  createAhighlight,
  deleteAhighlight,
  updateAhighlight,
  uploadAhighlightPhoto,
} = require("../controller/ahighlights");

const router = express.Router();

//"/api/v1/Ahighlights"
router
  .route("/")
  .get(getAhighlights)
  .post(protect, authorize("admin", "operator"), createAhighlight);

router
  .route("/:id")
  .get(getAhighlight)
  .delete(protect, authorize("admin", "operator"), deleteAhighlight)
  .put(protect, authorize("admin", "operator"), updateAhighlight);

router.route("/:id/upload-photo").put(uploadAhighlightPhoto);

module.exports = router;
