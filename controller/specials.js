const Special = require("../models/Special");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/works
exports.getSpecials = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Special);

  const specials = await Special.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: specials.length,
    data: specials,
    pagination,
  });
});

exports.getUserSpecials = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getSpecials(req, res, next);
});

exports.getSpecial = asyncHandler(async (req, res, next) => {
  const special = await Special.findById(req.params.id);

  if (!special) {
    throw new MyError(req.params.id + " ID-тэй ажил байхгүй байна.", 404);
  }
    // Хандалт тоологч
  if(special.count == null) {
      // default data
      const beginCount = new Special({
          count : 1
      })
      beginCount.save()
  }
  else {
      special.count += 1;
      special.save()
  }

  res.status(200).json({
    success: true,
    data: special,
  });
});

exports.createSpecial = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const special = await Special.create(req.body);

  res.status(200).json({
    success: true,
    data: special,
  });
});

exports.deleteSpecial = asyncHandler(async (req, res, next) => {
  const special = await Special.findById(req.params.id);

  if (!special) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    special.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  special.remove();

  res.status(200).json({
    success: true,
    data: special,
    whoDeleted: user.name,
  });
});

exports.updateSpecial = asyncHandler(async (req, res, next) => {
  const special = await Special.findById(req.params.id);

  if (!special) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    special.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    special[attr] = req.body[attr];
  }

  special.save();

  res.status(200).json({
    success: true,
    data: special,
  });
});

// PUT:  api/v1/works/:id/photo
exports.uploadSpecialPhoto = asyncHandler(async (req, res, next) => {
  const special = await Special.findById(req.params.id);

  if (!special) {
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

  file.name = `special__${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    special.photo = file.name;
    special.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
