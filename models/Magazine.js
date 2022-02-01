const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const MagazineSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      trim: true,
      maxlength: [250, " нэрний урт дээд тал нь 250 тэмдэгт байх ёстой."],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [250, " нэрний урт дээд тал нь 250 тэмдэгт байх ёстой."],
    },
    count: {
      type: Number,
      default: 0,
    },
    photo: {
      type: String,
      default: "no-photo",
    },
    photo2: {
      type: String,
      default: "no-photo",
    },

    content: {
      type: String,
      trim: true,
      maxlength: [250, " нэрний урт дээд тал нь 250 тэмдэгт байх ёстой."],
    },

    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MagazineSchema.virtual("zohiogch").get(function () {
  // this.author
  if (!this.author) return "";

  let tokens = this.author.split(" ");
  if (tokens.length === 1) tokens = this.author.split(".");
  if (tokens.length === 2) return tokens[1];

  return tokens[0];
});

module.exports = mongoose.model("Magazine", MagazineSchema);
