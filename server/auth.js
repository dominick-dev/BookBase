const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("./config");

const router = express.Router();
const JWT_SECRET = config.jwt_secret;

// google OAuth authentication routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(
      `http://localhost:3000/authenticate?token=${encodeURIComponent(token)}`
    );
  }
);

// facebook OAuth authentication routes
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// facebook OAuth callback route
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(
      `http://localhost:3000/authenticate?token=${encodeURIComponent(token)}`
    );
  }
);

// register user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      user_id: new mongoose.Types.ObjectId(),
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
