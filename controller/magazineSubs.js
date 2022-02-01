const MagazineSub = require("../models/MagazineSub");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

// api/v1/MagazineSub
exports.getMagazineSubs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, MagazineSub);

  const magazineSubs = await MagazineSub.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: magazineSubs.length,
    data: magazineSubs,
    pagination,
  });
});

exports.getMagazineSub = asyncHandler(async (req, res, next) => {
  const magazineSub = await MagazineSub.findById(req.params.id);

  if (!magazineSub) {
    throw new MyError(req.params.id + " ID-тэй ажил байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: magazineSub,
  });
});

exports.createMagazineSub = asyncHandler(async (req, res, next) => {
  const magazineSub = await MagazineSub.create(req.body);

  res.status(200).json({
    success: true,
    data: magazineSub,
  });
});

exports.deleteMagazineSub = asyncHandler(async (req, res, next) => {
  const magazineSub = await MagazineSub.findById(req.params.id);

  if (!magazineSub) {
    throw new MyError(req.params.id + " ID-тэй magazines байхгүй байна.", 404);
  }

  magazineSub.remove();

  res.status(200).json({
    success: true,
    data: magazineSub,
  });
});
