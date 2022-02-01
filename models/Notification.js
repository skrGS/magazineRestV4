const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const NotificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [250, " нэрний урт дээд тал нь 250 тэмдэгт байх ёстой."],
    },

    content: {
      type: String,
      trim: true,
      maxlength: [5000, " нэрний урт дээд тал нь 20 тэмдэгт байх ёстой."],
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

NotificationSchema.virtual("zohiogch").get(function () {
  // this.author
  if (!this.author) return "";

  let tokens = this.author.split(" ");
  if (tokens.length === 1) tokens = this.author.split(".");
  if (tokens.length === 2) return tokens[1];

  return tokens[0];
});

module.exports = mongoose.model("Notification", NotificationSchema);
