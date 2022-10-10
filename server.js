const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logEvents, logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// cors 설정
app.use(cors(corsOptions));

// formData를 핸들링하기 위한 빌트인 미들웨어 (즉,content-type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));
// json 파일을 핸들링하기 위한 빌트인 미들웨어
app.use(express.json());

// SERVER STATIC FILES
// 정적인 파일을 제공하기 위한 빌트인 미들웨어 (디폴트 url은 '/')
app.use("/", express.static(path.join(__dirname, "public")));

// ROUTE
// /로 오는 request는 모두 routes/root파일로 연결되게 함
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/employees", require("./routes/api/employees"));

// app.use('/') - does not accept regex  / used for middleware
// app.get("/*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

// app.all - accepts regex / used for routing
app.all("/*", (req, res) => {
  res.status(404);
  //  customize 404 depends on req extention name
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
