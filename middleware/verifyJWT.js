const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // forbidden - invalid token
    // 토큰이 있음에도 불구하고 문제가 발생, 즉, 만료되거나 변조된 것으로 볼 수 있음(tampered with)
    if (err) return res.sendStatus(403);

    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
