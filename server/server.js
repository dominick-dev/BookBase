const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");
const passport = require("passport");
const mongoose = require("mongoose");
const authRoutes = require("./auth");
const User = require("./models/User");
const authenticationToken = require("./middleware/authenticateToken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

// MongoDB connection
const mongoUri = config.mongo_uri;
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error: ", err));

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(passport.initialize());

// route to add to user's want to read list
app.post("/add-to-want-to-read", authenticationToken, async (req, res) => {
  const { isbn } = req.body;

  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  try {
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.want_to_read.includes(isbn)) {
      user.want_to_read.push(isbn);
      await user.save();
      return res.status(200).json({ message: "Book added to want to read" });
    }

    res.status(200).json({ message: "Book already in want to read" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// route to get user's want to read list
app.get("/get-want-to-read", authenticationToken, async (req, res) => {
  try {
    // extract userID from token
    const userId = req.user.id;

    // find user in DB
    const user = await User.findOne({ user_id: userId });

    // if user not found, return 404
    if (!user) return res.status(404).json({ message: "User not found" });

    // get want to read list from user object
    const wantToReadList = user.want_to_read || [];
    res.status(200).json({ want_to_read: wantToReadList });
  } catch (err) {
    console.error("Error retrieving want to read list: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// route to remove from user's want to read list
app.post("/remove-from-want-to-read", authenticationToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { isbn } = req.body;

    const user = await User.findOne({ user_id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.want_to_read = user.want_to_read.filter((book) => book !== isbn);
    await user.save();

    res.status(200).json({ message: "Book removed from want to read" });
  } catch (err) {
    console.error("Error removing book from want to read: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: config.google_redirect_uri,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            email,
            provider: "google",
            providerAccountId: profile.id,
            user_id: new mongoose.Types.ObjectId(),
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook_client_id,
      clientSecret: config.facebook_client_secret,
      callbackURL: config.facebook_redirect_uri,
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

      try {
        let user = await User.findOne({ email });
        if (!user) {
          console.log("User not found. Creating new user...");
          user = new User({
            email,
            provider: "facebook",
            providerAccountId: profile.id,
            user_id: new mongoose.Types.ObjectId(),
          });
          await user.save();
          console.log("User created successfully!", user);
        }
        done(null, user);
      } catch (err) {
        console.log("Error in Facebook Strategy: ", err);
        done(err, null);
      }
    }
  )
);

// routes
app.use("/auth", authRoutes);

// Route to test that server is running
app.get("/", (req, res) => {
  res.send("Express server running!");
});


// routes that exist but are not used in the frontend
app.get("/test-db", routes.testDatabaseConnection); // test connection to DB
app.get("/helpful-users", routes.helpfulUsers);

// to be used in the location page
app.get("/popular-books-by-location", routes.popularBooksByLocation);
app.get("/by-location/:column/:placeName", routes.byLocation);

// used in interesting page
app.get("/polarizing-books", routes.polarizingBooks);
app.get("/hidden-gems", routes.hiddenGems);
app.get("/top-reviewer-favorites/:genre", routes.topReviewerFavorites);
app.get("/magnum-opus/:author", routes.magnumOpus); // to be added to interesting page
app.get("/by-age-group/:age", routes.byAgeGroup); // to be added to interesting page

// used in HomePage
app.get("/20books", routes.get20Books);
app.get("/random", routes.random);
app.get("/author-stats", routes.authorStats);
app.get("/genre-stats", routes.genreStats);

// used in BookPage
app.get("/book/:isbn", (req, res) => {
  console.log("/book route hit");
  routes.bookByISBN(req, res);
});
app.get("/countriesList", routes.countriesList);
app.get("/reviewsWithCoordinates/:country", routes.reviewsWithCoordinates)

// used in BookPage
app.get("/reviews/:isbn", (req, res) => {
  console.log("/reviews route hit");
  routes.reviewsByISBN(req, res);
});

// used in SearchPage and BookPage
app.get("/search", (req, res) => {
  console.log("/search route hit");
  routes.searchBooks(req, res);
});

// Start the server
app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
