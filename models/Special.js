const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const SpecialSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    // Face
    facePhoto: {
      type: String,
      default: "no-photo.jpg",
    },
    faceTitle: {
      type: String,
      trim: true,
    },
    faceContent: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
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

SpecialSchema.virtual("zohiogch").get(function () {
  // this.author
  if (!this.author) return "";

  let tokens = this.author.split(" ");
  if (tokens.length === 1) tokens = this.author.split(".");
  if (tokens.length === 2) return tokens[1];

  return tokens[0];
});

module.exports = mongoose.model("Special", SpecialSchema);
