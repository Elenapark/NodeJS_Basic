const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // On client, delete the accessToken : it's not available from the backend.
  // backend just handles removing refresh token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  // 쿠키 없음? 어차피 없앨 거니까 문제 없음.
  // 204 stands for: this was successsfule, but with no content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db ?
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    // no foundUser but still exists cookie.
    // so clear cookie first.
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refresh token in the db
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  // clear cookie anyway.
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  return res.sendStatus(204);
};
module.exports = { handleLogout };
