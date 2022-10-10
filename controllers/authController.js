const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  // check if user and pw exist
  if (!user || !pwd)
    return res
      .status(400)
      .json({ "message:": "Username and Password are required" });

  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendState(401); // Stands for unathorized

  // 유저가 입력한 pwd와 기존에 저장된 유저 pwd를 비교
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWTs

    res.json({ success: `User ${user} is logged in` });
  } else {
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
