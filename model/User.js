const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // id field is automatically generated by ObjectId
  username: {
    type: String,
    required: true,
  },
  roles: {
    // default
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
// Mongoose automatically looks for the plural, lowercased version of your model name.
// ex) model 'Employee' is for the 'employees' collection in the database
