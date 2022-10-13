const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client, delete the accessToken : it's not available from the backend.
  // backend just handles removing refresh token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  // 쿠키 없음? 어차피 없앨 거니까 문제 없음.
  // 204 stands for: this was successsfule, but with no content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db ?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    // no foundUser but still exists cookie.
    // so clear cookie first.
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refresh token in the db

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log("로그아웃/리프레시토큰삭제:", result);

  // clear cookie anyway.
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
  return res.sendStatus(204);
};
module.exports = { handleLogout };
