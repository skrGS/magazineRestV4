const express = require("express");
const dotenv = require("dotenv");
var path = require("path");
var rfs = require("rotating-file-stream");
const colors = require("colors");
var morgan = require("morgan");
const logger = require("./middleware/logger");
const fileupload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Router оруулж ирэх
const highlightCatsRoutes = require("./routes/highlightCats");
const highlightsRoutes = require("./routes/highlights");
const booksRoutes = require("./routes/books");
const worksRoutes = require("./routes/works");
const webWorksRoutes = require("./routes/webworks");
const magazinesRoutes = require("./routes/magazines");
const ahighlightsRoutes = require("./routes/ahighlights");
const specialsRoutes = require("./routes/specials");
const notificationsRoutes = require("./routes/notifications");
const headerBannersRoutes = require("./routes/headerBanners");
const plusSubsRoutes = require("./routes/plusSubs");
const marketingSubsRoutes = require("./routes/marketingSub");
const magazineSubsRoutes = require("./routes/magazineSub");
const usersRoutes = require("./routes/users");
const injectDb = require("./middleware/injectDb");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

// Express апп үүсгэх
const app = express();

// MongoDB өгөгдлийн сантай холбогдох
connectDB();

// Манай рест апиг дуудах эрхтэй сайтуудын жагсаалт :
var whitelist = [
  "http://localhost:3000",
  "http://localhost:3005",
  "http://www.ihelp.mn",
  "http://ihelp.mn",
  "https://www.ihelp.mn",
  "https://ihelp.mn",
  "https://novelistgroup.com",
  "https://www.novelistgroup.com",
  "http://novelistgroup.com",
  "http://www.novelistgroup.com",
];

// Өөр домэйн дээр байрлах клиент вэб аппуудаас шаардах шаардлагуудыг энд тодорхойлно
var corsOptions = {
  // Ямар ямар домэйнээс манай рест апиг дуудаж болохыг заана
  origin: function (origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      // Энэ домэйнээс манай рест рүү хандахыг зөвшөөрнө
      callback(null, true);
    } else {
      // Энэ домэйнд хандахыг хориглоно.
      callback(new Error("Horigloj baina.."));
    }
  },
  // Клиент талаас эдгээр http header-үүдийг бичиж илгээхийг зөвшөөрнө
  allowedHeaders: "Authorization, Set-Cookie, Content-Type",
  // Клиент талаас эдгээр мэссэжүүдийг илгээхийг зөвөөрнө
  methods: "GET, POST, PUT, DELETE",
  // Клиент тал authorization юмуу cookie мэдээллүүдээ илгээхийг зөвшөөрнө
  credentials: true,
};
// index.html-ийг public хавтас дотроос ол гэсэн тохиргоо
app.use(express.static(path.join(__dirname, "public")));
// Express rate limit : Дуудалтын тоог хязгаарлана
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: "15 минутанд 3 удаа л хандаж болно! ",
});
app.use(limiter);
// http parameter pollution халдлагын эсрэг books?name=aaa&name=bbb  ---> name="bbb"
app.use(hpp());
// Cookie байвал req.cookie рүү оруулж өгнө0
app.use(cookieParser());
// Бидний бичсэн логгер
app.use(logger);
// Body дахь өгөгдлийг Json болгож өгнө
app.use(express.json());
// Өөр өөр домэйнтэй вэб аппуудад хандах боломж өгнө
app.use(cors(corsOptions));
// Клиент вэб аппуудыг мөрдөх ёстой нууцлал хамгаалалтыг http header ашиглан зааж өгнө
app.use(helmet());
// клиент сайтаас ирэх Cross site scripting халдлагаас хамгаална
app.use(xss());
// Клиент сайтаас дамжуулж буй MongoDB өгөгдлүүдийг халдлагаас цэвэрлэнэ
app.use(mongoSanitize());
// Сэрвэр рүү upload хийсэн файлтай ажиллана
app.use(fileupload());

// Morgan logger-ийн тохиргоо
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
app.use(morgan("combined", { stream: accessLogStream }));

// REST API RESOURSE
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/works", worksRoutes);
app.use("/api/v1/webworks", webWorksRoutes);
app.use("/api/v1/magazines", magazinesRoutes);
app.use("/api/v1/ahighlights", ahighlightsRoutes);
app.use("/api/v1/specials", specialsRoutes);
app.use("/api/v1/notifications", notificationsRoutes);
app.use("/api/v1/headerBanners", headerBannersRoutes);
app.use("/api/v1/plusSubs", plusSubsRoutes);
app.use("/api/v1/marketingSubs", marketingSubsRoutes);
app.use("/api/v1/magazineSubs", magazineSubsRoutes);
app.use("/api/v1/highlightCats", highlightCatsRoutes);
app.use("/api/v1/highlights", highlightsRoutes);
app.use("/api/v1/users", usersRoutes);

// Алдаа үүсэхэд барьж авч алдааны мэдээллийг клиент тал руу автоматаар мэдээлнэ
app.use(errorHandler);

// express сэрвэрийг асаана.
const server = app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.rainbow)
);

// Баригдалгүй цацагдсан бүх алдаануудыг энд барьж авна
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
