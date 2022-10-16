const User = require("../model/User");
// hash and salt the pw - so we can securely store them in our db
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  // check if user and pw exist
  if (!user || !pwd)
    return res
      .status(400)
      .json({ "message:": "Username and Password are required" });

  // check for duplicate username in the db
  // const duplicate = usersDB.users.find((person) => person.username === user);
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // Stands for Confiict

  try {
    // encrypt the pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // with mongoose :
    // 1) create and store the new user all at once
    const result = await User.create({
      username: user,
      // ** 스키마에 이미 role이 default처리되어있으므로 automatically added 될 예정
      // roles: {
      //   User: 2001,
      // },
      password: hashedPwd,
    });

    console.log("새로생성된유저:", result);

    // 2) Work same but in different ways (seperately)
    // const newUser = new User();
    // const result = await newUser.save();

    res.status(201).json({ success: `New User ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
