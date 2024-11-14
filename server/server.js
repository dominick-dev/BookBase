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
app.get("/search", routes.search);
app.get("/random", routes.random);
app.get("/popular-books-by-location", routes.popularBooksByLocation);
app.get("/polarizing-books", routes.polarizingBooks);
app.get("/by-age-group", routes.byAgeGroup);
app.get("/by-location", routes.byLocation)
app.get("/top-reviewer-favorites/:genre", routes.topReviewerFavorites);
app.get("/magnum-opus/:author", routes.magnumOpus);
app.get("/hidden-gems", routes.hiddenGems);
app.get("/helpful-users", routes.helpfulUsers)
app.get("/author-stats", routes.authorStats)

// Start the server
app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
