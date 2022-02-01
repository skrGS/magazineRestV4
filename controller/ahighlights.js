const Ahighlight = require("../models/Ahighlight");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/works
exports.getAhighlights = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Ahighlight);

  const ahighlights = await Ahighlight.find(req.query, select)
    .populate({
      path: "category",

      select: "name ",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: ahighlights.length,
    data: ahighlights,
    pagination,
  });
});

exports.getUserAhighlights = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getAhighlights(req, res, next);
});

exports.getAhighlight = asyncHandler(async (req, res, next) => {
  const ahighlight = await Ahighlight.findById(req.params.id);

  if (!ahighlight) {
    throw new MyError(req.params.id + " ID-тэй ажил байхгүй байна.", 404);
  }

  // Хандалт тоологч
  if (ahighlight.count == null) {
      // default data
      const beginCount = new Ahighlight({
          count : 1
      })
      beginCount.save()
  }
  else {
      ahighlight.count += 1;
      ahighlight.save()
  }

  res.status(200).json({
    success: true,
    data: ahighlight,
  });
});

exports.createAhighlight = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;

  const ahighlight = await Ahighlight.create(req.body);

  res.status(200).json({
    success: true,
    data: ahighlight,
  });
});

exports.deleteAhighlight = asyncHandler(async (req, res, next) => {
  const ahighlight = await Ahighlight.findById(req.params.id);

  if (!ahighlight) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    ahighlight.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  ahighlight.remove();

  res.status(200).json({
    success: true,
    data: ahighlight,
    whoDeleted: user.name,
  });
});

exports.updateAhighlight = asyncHandler(async (req, res, next) => {
  const ahighlight = await Ahighlight.findById(req.params.id);

  if (!ahighlight) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    ahighlight.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    ahighlight[attr] = req.body[attr];
  }

  ahighlight.save();

  res.status(200).json({
    success: true,
    data: ahighlight,
  });
});

// PUT:  api/v1/works/:id/photo
exports.uploadAhighlightPhoto = asyncHandler(async (req, res, next) => {
  const ahighlight = await Ahighlight.findById(req.params.id);

  if (!ahighlight) {
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

  file.name = `ahighlight__${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    ahighlight.photo = file.name;
    ahighlight.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
