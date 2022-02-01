const HeaderBanner = require("../models/HeaderBanner");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/books
exports.getHeaderBanners = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, HeaderBanner);

  const headerBanners = await HeaderBanner.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: headerBanners.length,
    data: headerBanners,
    pagination,
  });
});

exports.getUserHeaderBanners = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getHeaderBanners(req, res, next);
});

// api/v1/categories/:catId/books

exports.getHeaderBanner = asyncHandler(async (req, res, next) => {
  const headerBanner = await HeaderBanner.findById(req.params.id);

  if (!headerBanner) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

      headerBanner.count += 1;
      headerBanner.save()
      console.log("visitor arrived: ",headerBanner.count)

  res.status(200).json({
    success: true,
    data: headerBanner,
  });
});

exports.createHeaderBanner = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const headerBanner = await HeaderBanner.create(req.body);

  res.status(200).json({
    success: true,
    data: headerBanner,
  });
});

exports.deleteHeaderBanner = asyncHandler(async (req, res, next) => {
  const headerBanner = await HeaderBanner.findById(req.params.id);

  if (!HeaderBanner) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    headerBanner.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  headerBanner.remove();

  res.status(200).json({
    success: true,
    data: headerBanner,
    whoDeleted: user.name,
  });
});

exports.updateHeaderBanner = asyncHandler(async (req, res, next) => {
  const headerBanner = await HeaderBanner.findById(req.params.id);

  if (!headerBanner) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    headerBanner.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    headerBanner[attr] = req.body[attr];
  }

  headerBanner.save();

  res.status(200).json({
    success: true,
    data: headerBanner,
  });
});

// PUT:  api/v1/books/:id/photo
exports.uploadHeaderBannerPhoto = asyncHandler(async (req, res, next) => {
  const headerBanner = await HeaderBanner.findById(req.params.id);

  if (!headerBanner) {
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

  file.name = `headerBanner__${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    headerBanner.photo = file.name;
    headerBanner.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
