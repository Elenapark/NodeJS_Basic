const User = require("../model/User");

const getAllUsers = async (req, res) => {
  const user = await User.find();
  if (!user) {
    return res.status(204).json({ message: "No user found." });
  }
  console.log("모든유저정보", user);
  res.json(user);
};

const deleteUser = async (req, res) => {
  if (!req.body?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `No user matches ID:${req.body.id}.` });
  }

  const result = await user.deleteOne({ _id: req.body.id });
  console.log("유저삭제:", result);
  res.json({
    data: result,
    message: "deleted successfully",
  });
};

const getUser = async (req, res) => {
  if (!req.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    return res
      .status(204)
      .json({ message: `No user matches ID:${req.params.id}.` });
  }
  console.log("단일유저정보:", user);
  res.json(user);
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
};
