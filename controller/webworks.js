const WebWork = require("../models/WebWork");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/works
exports.getWebWorks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, WebWork);

  const webworks = await WebWork.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: webworks.length,
    data: webworks,
    pagination,
  });
});

exports.getUserWebWorks = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getWebWorks(req, res, next);
});

exports.getWebWork = asyncHandler(async (req, res, next) => {
  const webwork = await WebWork.findById(req.params.id);

  if (!webwork) {
    throw new MyError(req.params.id + " ID-тэй ажил байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: webwork,
  });
});

exports.createWebWork = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const webwork = await WebWork.create(req.body);

  res.status(200).json({
    success: true,
    data: webwork,
  });
});

exports.deleteWebWork = asyncHandler(async (req, res, next) => {
  const webwork = await WebWork.findById(req.params.id);

  if (!webwork) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    webwork.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  webwork.remove();

  res.status(200).json({
    success: true,
    data: webwork,
    whoDeleted: user.name,
  });
});

exports.updateWebWork = asyncHandler(async (req, res, next) => {
  const webwork = await WebWork.findById(req.params.id);

  if (!webwork) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    webwork.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    webwork[attr] = req.body[attr];
  }

  webwork.save();

  res.status(200).json({
    success: true,
    data: webwork,
  });
});

// PUT:  api/v1/works/:id/photo
exports.uploadWebWorkPhoto = asyncHandler(async (req, res, next) => {
  const webwork = await WebWork.findById(req.params.id);

  if (!webwork) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээ.", 400);
  }

  // image upload

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү.", 400);
  }

  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError("Таны зурагны хэмжээ хэтэрсэн байна.", 400);
  }

  file.name = `webwork__${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    webwork.photo = file.name;
    webwork.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
