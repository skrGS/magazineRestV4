const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Magazine = require("./models/Magazine");
const HeaderBanner = require("./models/HeaderBanner");
const Highlight = require("./models/Highlight");
const HighlightCat = require("./models/HighlightCat");
const Ahighlight = require("./models/Ahighlight");
const Special = require("./models/Special");
dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// const users = JSON.parse(
//   fs.readFileSync(__dirname + "/data/user.json", "utf-8")
// );
const magazines = JSON.parse(
  fs.readFileSync(__dirname + "/data/magazine.json", "utf-8")
);
const headerBanners = JSON.parse(
  fs.readFileSync(__dirname + "/data/headerBanner.json", "utf-8")
);

const highlights = JSON.parse(
  fs.readFileSync(__dirname + "/data/highlight.json", "utf-8")
);

const highlightCats = JSON.parse(
  fs.readFileSync(__dirname + "/data/highlightCat.json", "utf-8")
);

const ahighlights = JSON.parse(
  fs.readFileSync(__dirname + "/data/ahighlight.json", "utf-8")
);
const specials = JSON.parse(
  fs.readFileSync(__dirname + "/data/special.json", "utf-8")
);
const importData = async () => {
  try {
    // await User.create(users);
    await Magazine.create(magazines);
    await HeaderBanner.create(headerBanners);
    await Highlight.create(highlights);
    await Ahighlight.create(ahighlights);
    await Special.create(specials);

    await HighlightCat.create(highlightCats);
    console.log("Өгөгдлийг импортлолоо....".green.inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    // await User.deleteMany();
    await Magazine.deleteMany();
    await HeaderBanner.deleteMany();
    await Ahighlight.deleteMany();
    await Special.deleteMany();
    await HighlightCat.deleteMany();
    await Highlight.deleteMany();
    console.log("Өгөгдлийг бүгдийг устгалаа....".red.inverse);
  } catch (err) {
    console.log(err.red.inverse);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
