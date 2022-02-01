const MarketingSub = require("../models/MarketingSub");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

// api/v1/MarketingSub
exports.getMarketingSubs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, MarketingSub);

  const marketingSubs = await MarketingSub.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: marketingSubs.length,
    data: marketingSubs,
    pagination,
  });
});

exports.getMarketingSub = asyncHandler(async (req, res, next) => {
  const marketingSub = await MarketingSub.findById(req.params.id);

  if (!marketingSub) {
    throw new MyError(
      req.params.id + " ID-тэй marketing subs байхгүй байна.",
      404
    );
  }

  res.status(200).json({
    success: true,
    data: marketingSub,
  });
});

exports.createMarketingSub = asyncHandler(async (req, res, next) => {
  const marketingSub = await MarketingSub.create(req.body);

  res.status(200).json({
    success: true,
    data: marketingSub,
  });
});

exports.deleteMarketingSub = asyncHandler(async (req, res, next) => {
  const marketingSub = await MarketingSub.findById(req.params.id);

  if (!marketingSub) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  marketingSub.remove();

  res.status(200).json({
    success: true,
    data: marketingSub,
  });
});
