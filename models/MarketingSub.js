const mongoose = require("mongoose");

const MarketingSubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [250, "Номын нэрний урт дээд тал нь 250 тэмдэгт байх ёстой."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MarketingSubSchema.virtual("zohiogch").get(function () {
  // this.author
  if (!this.author) return "";

  let tokens = this.author.split(" ");
  if (tokens.length === 1) tokens = this.author.split(".");
  if (tokens.length === 2) return tokens[1];

  return tokens[0];
});

module.exports = mongoose.model("MarketingSub", MarketingSubSchema);
