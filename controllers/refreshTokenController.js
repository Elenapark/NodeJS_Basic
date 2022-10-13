const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log("쿠키:", cookies);
  if (!cookies?.jwt) return res.sendStatus(401); // unathorized
  const refreshToken = cookies.jwt;

  // cookie는 있지만 refresh token이 일치하지 않는 경우 -> 만료된 경우?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Stands for Forbidden

  // evalutate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log(`decoded_refresh:`, decoded);
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403); // forbidden

    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};
module.exports = { handleRefreshToken };
