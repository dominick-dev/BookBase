const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// Route to test that server is running
app.get("/", (req, res) => {
  res.send("Express server running!");
});

// Route to test connection to DB
app.get("/test-db", routes.testDatabaseConnection);

// Bookbase routes
// Route 1: GET /searchBooks?author=&title=&genre=&isbn=&limit=
// example: /searchBooks?author=J.K. Rowling&limit=5
// example using all parameters Ursula Hegi,SALT DANCERS,16,0684825309
// /searchBooks?author=Ursula Hegi&title=SALT DANCERS&limit=16&isbn=0684825309
app.get("/searchBooks", (req, res) => {
  const { author, title, genre, isbn, limit } = req.query;
  routes.searchBooks(req, res, { author, title, genre, isbn, limit });
});
app.get("/random", routes.random);
app.get("/popular-books-by-location", routes.popularBooksByLocation);
app.get("/polarizing-books", routes.polarizingBooks);
app.get("/by-age-group/:birthYear", routes.byAgeGroup);
app.get("/by-location/:column/:placeName", routes.byLocation)
app.get("/top-reviewer-favorites/:genre", routes.topReviewerFavorites);
app.get("/magnum-opus/:author", routes.magnumOpus);
app.get("/hidden-gems", routes.hiddenGems);
app.get("/helpful-users", routes.helpfulUsers);
app.get("/author-stats", routes.authorStats);
app.get("/genre-stats", routes.genreStats);
app.get("/20books", routes.get20Books);
app.get("/book/:isbn", (req, res) => {
  req.query.field = "isbn";
  req.query.query = req.params.isbn;
  routes.searchBooks(req, res);
});

app.get("/reviews/:isbn", (req, res) => {
  console.log("ISBN from params:", req.params.isbn);
  req.query.field = "isbn";
  req.query.query = req.params.isbn;
  routes.searchReviews(req, res);
});

// search?author=&title=&genre=&isbn=&limit=
app.get("/search", (req, res) => {
  console.log("search route hit");
  routes.searchBooks(req, res);
});

// Start the server
app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
