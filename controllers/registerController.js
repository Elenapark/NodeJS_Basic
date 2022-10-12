const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

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
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) res.sendStatus(409); // Stands for Confiict

  try {
    // encrypt the pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // stroe the new user
    const newUser = {
      username: user,
      roles: {
        User: 2001,
      },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({ success: `New User ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
