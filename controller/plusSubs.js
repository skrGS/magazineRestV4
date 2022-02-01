const PlusSub = require("../models/PlusSub");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

// api/v1/PlusSub
exports.getPlusSubs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, PlusSub);

  const plusSubs = await PlusSub.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: plusSubs.length,
    data: plusSubs,
    pagination,
  });
});

exports.getPlusSub = asyncHandler(async (req, res, next) => {
  const plusSub = await PlusSub.findById(req.params.id);

  if (!plusSub) {
    throw new MyError(req.params.id + " ID-тэй ажил байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: plusSub,
  });
});

exports.createPlusSub = asyncHandler(async (req, res, next) => {
  const plusSub = await PlusSub.create(req.body);

  res.status(200).json({
    success: true,
    data: plusSub,
  });
});

exports.deletePlusSub = asyncHandler(async (req, res, next) => {
  const plusSub = await PlusSub.findById(req.params.id);

  if (!plusSub) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  plusSub.remove();

  res.status(200).json({
    success: true,
    data: plusSub,
  });
});
