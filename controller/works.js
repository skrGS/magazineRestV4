const Work = require("../models/Work");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/works
exports.getWorks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Work);

  const works = await Work.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: works.length,
    data: works,
    pagination,
  });
});

exports.getUserWorks = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getWorks(req, res, next);
});

exports.getWork = asyncHandler(async (req, res, next) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
    throw new MyError(req.params.id + " ID-тэй ажил байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: work,
  });
});

exports.createWork = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const work = await Work.create(req.body);

  res.status(200).json({
    success: true,
    data: work,
  });
});

exports.deleteWork = asyncHandler(async (req, res, next) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (work.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  work.remove();

  res.status(200).json({
    success: true,
    data: work,
    whoDeleted: user.name,
  });
});

exports.updateWork = asyncHandler(async (req, res, next) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (work.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    work[attr] = req.body[attr];
  }

  work.save();

  res.status(200).json({
    success: true,
    data: work,
  });
});

// PUT:  api/v1/works/:id/photo
exports.uploadWorkPhoto = asyncHandler(async (req, res, next) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
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

  file.name = `work__${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    work.photo = file.name;
    work.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
