const HighlightCat = require("../models/HighlightCat");

const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.getHighlightCats = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, HighlightCat);

  const highlightCats = await HighlightCat.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: highlightCats,
    pagination,
  });
});

exports.getHighlightCat = asyncHandler(async (req, res, next) => {
  const highlightCat = await HighlightCat.findById(req.params.id).populate(
    "books"
  );

  if (!highlightCat) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: highlightCat,
  });
});

exports.createHighlightCat = asyncHandler(async (req, res, next) => {
  const highlightCat = await HighlightCat.create(req.body);

  res.status(200).json({
    success: true,
    data: highlightCat,
  });
});

exports.updateHighlightCat = asyncHandler(async (req, res, next) => {
  const highlightCat = await HighlightCat.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!highlightCat) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: highlightCat,
  });
});

exports.deleteHighlightCat = asyncHandler(async (req, res, next) => {
  const highlightCat = await HighlightCat.findById(req.params.id);

  if (!highlightCat) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  highlightCat.remove();

  res.status(200).json({
    success: true,
    data: highlightCat,
  });
});
