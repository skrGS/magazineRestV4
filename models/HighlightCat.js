const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const HighlightCatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Категорийн нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [
        50,
        "Категорийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой.",
      ],
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

HighlightCatSchema.virtual("highlights", {
  ref: "Highlight",
  localField: "_id",
  foreignField: "highlightCat",
  justOne: false,
});

HighlightCatSchema.pre("remove", async function (next) {
  console.log("removing ....");
  await this.model("HighlightCat").deleteMany({ highlightCat: this._id });
  next();
});

HighlightCatSchema.pre("save", function (next) {
  // name хөрвүүлэх
  this.slug = slugify(this.name);
  // this.averagePrice = Math.floor(Math.random() * 100000) + 3000;
  next();
});

module.exports = mongoose.model("HighlightCat", HighlightCatSchema);
