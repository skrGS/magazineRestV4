const Highlight = require("../models/Highlight");
const path = require("path");
const HighlightCat = require("../models/HighlightCat");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/Highlights
exports.getHighlights = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Highlight);

  const highlights = await Highlight.find(req.query, select)
    .populate({
      path: "highlightCat",
      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: highlights.length,
    data: highlights,
    pagination,
  });
});

exports.getUserHighlights = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getHighlights(req, res, next);
});

// api/v1/categories/:catId/Highlights
exports.getHighlightCatHighlights = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Highlight);

  //req.query, select
  const highlights = await Highlight.find(
    { ...req.query, highlightCat: req.params.highlightCatId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: highlights.length,
    data: highlights,
    pagination,
  });
});

exports.getHighlight = asyncHandler(async (req, res, next) => {
  const highlight = await Highlight.findById(req.params.id);

  if (!highlight) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }
  // Хандалт тоологч
  if (highlight.count == null) {
      // default data
      const beginCount = new Highlight({
          count : 1
      })
      beginCount.save()
  }
  else {
      highlight.count += 1;
      highlight.save()
  }
  

  res.status(200).json({
    success: true,
    data: highlight,
  });
});

exports.createHighlightCat = asyncHandler(async (req, res, next) => {
  const highlightCat = await HighlightCat.create(req.body);

  res.status(200).json({
    success: true,
    data: highlightCat,
  });
});

exports.createHighlight = asyncHandler(async (req, res, next) => {
  const highlightCat = await HighlightCat.findById(req.body.highlightCat);

  if (!highlightCat) {
    throw new MyError(req.body.highlightCat + " ID-тэй категори байхгүй!", 400);
  }

  req.body.createUser = req.userId;

  const highlight = await Highlight.create(req.body);

  res.status(200).json({
    success: true,
    data: highlight,
  });
});

exports.deleteHighlight = asyncHandler(async (req, res, next) => {
  const highlight = await Highlight.findById(req.params.id);

  if (!highlight) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    highlight.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  highlight.remove();

  res.status(200).json({
    success: true,
    data: highlight,
    whoDeleted: user.name,
  });
});

exports.updateHighlight = asyncHandler(async (req, res, next) => {
  const highlight = await Highlight.findById(req.params.id);

  if (!highlight) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    highlight.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    highlight[attr] = req.body[attr];
  }

  highlight.save();

  res.status(200).json({
    success: true,
    data: highlight,
  });
});

// PUT:  api/v1/Highlights/:id/photo
exports.uploadHighlightPhoto = asyncHandler(async (req, res, next) => {
  const highlight = await Highlight.findById(req.params.id);

  if (!highlight) {
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

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    highlight.photo = file.name;
    highlight.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
