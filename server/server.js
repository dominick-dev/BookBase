const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");
const passport = require("passport");
const mongoose = require("mongoose");
const authRoutes = require("./auth");
const User = require("./models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

// MongoDB connection
const mongoUri = config.mongo_uri;
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log('MongoDB connection error: ', err));
  
const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(passport.initialize());


// google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: config.google_callback_url,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            email,
            provider: 'google',
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
)

// facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook_client_id,
      clientSecret: config.facebook_client_secret,
      callbackURL: config.facebook_redirect_uri,
      profileFields: ['id', 'emails', 'name'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            email,
            provider: 'facebook',
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
)

// routes
app.use("/auth", authRoutes);

// Route to test that server is running
app.get("/", (req, res) => {
  res.send("Express server running!");
});

// Route to test connection to DB
app.get("/test-db", routes.testDatabaseConnection);

// Bookbase routes
app.get("/search", routes.search);
app.get("/random", routes.random);
app.get("/popular-books-by-location", routes.popularBooksByLocation);
app.get("/polarizing-books", routes.polarizingBooks);
app.get("/by-age-group/:birthYear", routes.byAgeGroup);
app.get("/by-location/:column/:placeName", routes.byLocation);
app.get("/top-reviewer-favorites/:genre", routes.topReviewerFavorites);
app.get("/magnum-opus/:author", routes.magnumOpus);
app.get("/hidden-gems", routes.hiddenGems);
app.get("/helpful-users", routes.helpfulUsers);
app.get("/author-stats", routes.authorStats);
app.get("/genre-stats", routes.genreStats);

// Start the server
app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
