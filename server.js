const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logEvents, logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// apply cross origin resource sharing
// 다른 사이트에서 나의 서버에 request를 보내는 것을 허가하는 두가지 방법

// 1. 모든 사이트에 제한 없이 허가
// app.use(cors());

// 2. 모든 사이트가 아닌 특정 도메인에만 request 보내는 것을 허가 (ex,google에만 허용)
const whitelist = ["https://www.google.com", "http://localhost:3500"];
const corsOptions = {
  origin: (origin, callback) => {
    // origin : req를 보내는 domain
    console.log("request domain", origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// formData를 핸들링하기 위한 빌트인 미들웨어 (즉,content-type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));
// json 파일을 핸들링하기 위한 빌트인 미들웨어
app.use(express.json());
// 정적인 파일을 제공하기 위한 빌트인 미들웨어
app.use("/", express.static(path.join(__dirname, "public")));
// subdir용으로 정적 파일 제공
app.use("/subdir", express.static(path.join(__dirname, "public")));

// /subdir로 오는 request는 모두 routes/subdir파일로 연결되게 함
app.use("/subdir", require("./routes/subdir"));

app.get("^/$|/index(.html)?", (req, res) => {
  // res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); // status code : 302 by default 이므로 301로 지정 필요
});

// route handler

app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("hello world");
  }
);

const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  console.log("three");
  res.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);

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
