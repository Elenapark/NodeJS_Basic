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

module.exports = corsOptions;
