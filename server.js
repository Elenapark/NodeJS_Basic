require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logEvents, logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

const PORT = process.env.PORT || 3500;

// Connect to DB
connectDB();

// custom middleware logger
app.use(logger);

// handle option credentials check - before CORS setting!
// cors설정 이전에 하는 이유는 cors가 response header에 credential setting이 안되어있는
// 요청에 대해 에러 처리를 하므로
app.use(credentials);

// middleware for cookies
app.use(cookieParser());

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
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
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

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
