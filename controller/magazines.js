const Magazine = require("../models/Magazine");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/magazines
exports.getMagazines = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Magazine);

  const magazines = await Magazine.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: magazines.length,
    data: magazines,
    pagination,
  });
});

exports.getUserMagazines = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getMagazines(req, res, next);
});

exports.getMagazine = asyncHandler(async (req, res, next) => {
  const magazine = await Magazine.findById(req.params.id);

  if (!magazine) {
    throw new MyError(req.params.id + " ID-тэй ажил байхгүй байна.", 404);
  }
  // Хандалт тоологч
  if(magazine.count === null) {
    // default data
    const beginCount = new Magazine({
        count : 1
    })
    beginCount.save()
}
else {
    magazine.count += 1;
    magazine.save()
    console.log("visitor arrived: ",magazine.count)
}

  res.status(200).json({
    success: true,
    data: magazine,
  });
});

exports.createMagazine = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const magazine = await Magazine.create(req.body);

  res.status(200).json({
    success: true,
    data: magazine,
  });
});

exports.deleteMagazine = asyncHandler(async (req, res, next) => {
  const magazine = await Magazine.findById(req.params.id);

  if (!magazine) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    magazine.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  magazine.remove();

  res.status(200).json({
    success: true,
    data: magazine,
    whoDeleted: user.name,
  });
});

exports.updateMagazine = asyncHandler(async (req, res, next) => {
  const magazine = await Magazine.findById(req.params.id);

  if (!magazine) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    magazine.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    magazine[attr] = req.body[attr];
  }

  magazine.save();

  res.status(200).json({
    success: true,
    data: magazine,
  });
});

// PUT:  api/v1/magazines/:id/photo
exports.uploadMagazinePhoto = asyncHandler(async (req, res, next) => {
  const magazine = await Magazine.findById(req.params.id);

  if (!magazine) {
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

  file.name = `magazine_${req.params.id}_${magazine.photo.length}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    magazine.photo.push(file.name);
    magazine.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
