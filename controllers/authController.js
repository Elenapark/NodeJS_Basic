const User = require("../model/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  // check if user and pw exist
  if (!user || !pwd)
    return res
      .status(400)
      .json({ "message:": "Username and Password are required" });

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); // Stands for unathorized

  // 유저가 입력한 pwd와 기존에 저장된 유저 pwd를 비교
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);

    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    // only for getting new access_token
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // saving refresh token with user to database

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log("로그인한유저:", result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1day
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
