const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  want_to_read: {
    type: [String],
    default: [],
  },
  provider: {
    type: String,
    default: "credentials",
  },
  providerAccountId: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
