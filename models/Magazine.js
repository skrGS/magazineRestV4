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

    ads1: {
      type: String,
      default: "no-photo",
    },
    ads2: {
      type: String,
      default: "no-photo",
    },
    ads3: {
      type: String,
      default: "no-photo",
    },
    ads4: {
      type: String,
      default: "no-photo",
    },
    ads5: {
      type: String,
      default: "no-photo",
    },
    ads6: {
      type: String,
      default: "no-photo",
    },
    ads7: {
      type: String,
      default: "no-photo",
    },
    ads8: {
      type: String,
      default: "no-photo",
    },
    ads9: {
      type: String,
      default: "no-photo",
    },
    ads10: {
      type: String,
      default: "no-photo",
    },
    ads11: {
      type: String,
      default: "no-photo",
    },
    ads12: {
      type: String,
      default: "no-photo",
    },
    photo2: {
      type: String,
      default: "no-photo",
    },
    facePhoto: {
      type: String,
      default: "no-photo",
    },
    faceLogo: {
      type: String,
      default: "no-photo",
    },
    faceLogo2: {
      type: String,
      default: "no-photo",
    },

    p1Bayka: {
      type: String,
      default: "no-photo",
    },
    p1BaykaSpecial: {
      type: String,
      trim: true,
    },
    p1Ariuka: {
      type: String,
      default: "no-photo",
    },
    p1Bolor: {
      type: String,
      default: "no-photo",
    },
    p1Odbaysal: {
      type: String,
      default: "no-photo",
    },
    p1BinanceBg: {
      type: String,
      default: "no-photo",
    },

    p1BinanceTeam: {
      type: String,
      default: "no-photo",
    },
    p1Delgermend: {
      type: String,
      default: "no-photo",
    },
    p1Batdavaa: {
      type: String,
      default: "no-photo",
    },
    p1Tech: {
      type: String,
      default: "no-photo",
    },
    p2Naki: {
      type: String,
      default: "no-photo",
    },
    p2Logo: {
      type: String,
      default: "no-photo",
    },

    p3BayFace: {
      type: String,
      default: "no-photo",
    },
    p3Bay1: {
      type: String,
      default: "no-photo",
    },
    p3Bay2: {
      type: String,
      default: "no-photo",
    },
    p4ArFace: {
      type: String,
      default: "no-photo",
    },
    p4Ar1: {
      type: String,
      default: "no-photo",
    },
    p4Ar2: {
      type: String,
      default: "no-photo",
    },
    p5BoFace: {
      type: String,
      default: "no-photo",
    },
    p5Bo1: {
      type: String,
      default: "no-photo",
    },
    p5Bo2: {
      type: String,
      default: "no-photo",
    },
    p5Bo3: {
      type: String,
      default: "no-photo",
    },
    p5Bo4: {
      type: String,
      default: "no-photo",
    },
    p6Pony1: {
      type: String,
      default: "no-photo",
    },
    p6Pony2: {
      type: String,
      default: "no-photo",
    },
    p7Ceo1: {
      type: String,
      default: "no-photo",
    },
    p7Ceo2: {
      type: String,
      default: "no-photo",
    },
    p7Ceo3: {
      type: String,
      default: "no-photo",
    },
    p7Ceo4: {
      type: String,
      default: "no-photo",
    },
    p7Ceo5: {
      type: String,
      default: "no-photo",
    },
    p7Ceo6: {
      type: String,
      default: "no-photo",
    },
    p7Ceo7: {
      type: String,
      default: "no-photo",
    },
    p7Ceo8: {
      type: String,
      default: "no-photo",
    },
    p7Ceo9: {
      type: String,
      default: "no-photo",
    },
    p7Ceo10: {
      type: String,
      default: "no-photo",
    },
    p8Career1: {
      type: String,
      default: "no-photo",
    },
    p8Career2: {
      type: String,
      default: "no-photo",
    },
    p8Career3: {
      type: String,
      default: "no-photo",
    },
    p8Career4: {
      type: String,
      default: "no-photo",
    },
    p8Career5: {
      type: String,
      default: "no-photo",
    },
    p8Career6: {
      type: String,
      default: "no-photo",
    },
    p8Career7: {
      type: String,
      default: "no-photo",
    },
    p8Career8: {
      type: String,
      default: "no-photo",
    },
    p8CareerBg: {
      type: String,
      default: "no-photo",
    },

    p9Od1: {
      type: String,
      default: "no-photo",
    },
    p9Od2: {
      type: String,
      default: "no-photo",
    },
    p10BiCeo: {
      type: String,
      default: "no-photo",
    },
    p10BiTable: {
      type: String,
      default: "no-photo",
    },
    p10BiEco: {
      type: String,
      default: "no-photo",
    },
    p10BiGraph: {
      type: String,
      default: "no-photo",
    },
    p10BiCompany: {
      type: String,
      default: "no-photo",
    },
    p10BiFriends: {
      type: String,
      default: "no-photo",
    },
    p10BiGraph1: {
      type: String,
      default: "no-photo",
    },

    p11De1: {
      type: String,
      default: "no-photo",
    },

    p12Ba1: {
      type: String,
      default: "no-photo",
    },
    p12Ba2: {
      type: String,
      default: "no-photo",
    },
    p12BaTable: {
      type: String,
      default: "no-photo",
    },
    p13TechFace: {
      type: String,
      default: "no-photo",
    },
    p13Tech1: {
      type: String,
      default: "no-photo",
    },
    p13Tech2: {
      type: String,
      default: "no-photo",
    },
    p13Tech3: {
      type: String,
      default: "no-photo",
    },
    p13Tech4: {
      type: String,
      default: "no-photo",
    },
    p13Tech5: {
      type: String,
      default: "no-photo",
    },
    p13Tech6: {
      type: String,
      default: "no-photo",
    },
    p13Tech7: {
      type: String,
      default: "no-photo",
    },
    p13Tech8: {
      type: String,
      default: "no-photo",
    },
    p13Tech9: {
      type: String,
      default: "no-photo",
    },
    p13Tech10: {
      type: String,
      default: "no-photo",
    },
    p14CoinFace: {
      type: String,
      default: "no-photo",
    },
    p14Coin1: {
      type: String,
      default: "no-photo",
    },
    p14CoinTable: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo1: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo2: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo3: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo4: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo5: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo6: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo7: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo8: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo9: {
      type: String,
      default: "no-photo",
    },
    p14CoinLogo10: {
      type: String,
      default: "no-photo",
    },
    faceName: {
      type: String,
    },
    faceText: {
      type: String,
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
