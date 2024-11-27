const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        default: uuidv4(),
    },
    want_to_read: {
        type: [String],
        default: [],
    },
})

const User = mongoose.model("User", userSchema);

module.exports = User;