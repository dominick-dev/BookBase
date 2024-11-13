const { Pool, types } = require("pg");
const config = require("./config.json");

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, (val) => parseInt(val, 10)); //DO NOT DELETE THIS

// Create PostgreSQL connection using database credentials provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

// routes...
// Route 1: Use to test connection to PostgreSQL db
const testDatabaseConnection = async (req, res) => {
  try {
    const result = await connection.query("SELECT 1");
    res.json({
      message: "Database connected successfully",
      result: result.rows,
    });
  } catch (err) {
    console.error("Error testing database connection:", err);
    res.status(500).json({ error: "Failed to connect to the database" });
  }
};

// Route 2: GET /search?field?query?limit
const search = async (req, res) => {
  const { field, query, limit } = req.query;

  // define allowed fields
  const allowedFields = ["title", "isbn", "author", "publisher"];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: "Invalid search parameter" });
  }

  // set limit to 10 if not given
  const resLimit = limit ? parseInt(limit, 10) : 10;

  try {
    const result = await connection.query(
      `SELECT * FROM book WHERE ${field} ILIKE $1 LIMIT $2`,
      [`%${query}%`, resLimit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing search query", err);
    res.status(500).json({ error: "Failed to execute search query" });
  }
};

// Route 3: GET /random
const random = async (req, res) => {
  try {
    const result = await connection.query(`
        SELECT *
        FROM book
        ORDER BY RANDOM()
        LIMIT 1
      `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching random book", err);
    res.status(500).json({ error: "Failed to fetch random book" });
  }
};

// Route 4: GET /popular-books-by-location
const popularBooksByLocation = async (req, res) => {
  const { latitude, longitude } = req.query;

  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);

  // ensure lat and long are provided
  if (isNaN(lat) || isNaN(long)) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const result = await connection.query(
      `
      WITH location_filtered_users AS (
        SELECT
            p.userId,
            r.isbn,
            l.latitude,
            l.longitude,
            r.score,
            l.location_id,
            l.city,
            l.state,
            l.country
        FROM person p
                JOIN review r ON p.userId = r.userId
                JOIN location l ON p.location_id = l.location_id
        WHERE l.latitude BETWEEN CAST($1 AS float8) - 2 AND CAST($1 AS float8) + 2
          AND l.longitude BETWEEN CAST($2 AS float8) - 2 AND CAST($2 AS float8) + 2
    ),
        geographic_popular_books AS (
            SELECT
                lfu.isbn,
                b.title,
                b.author,
                COUNT(lfu.userId) AS review_count,
                ROUND(CAST(AVG(lfu.score) AS numeric), 2) AS avg_rating,
                lfu.city,
                lfu.state,
                lfu.country
            FROM location_filtered_users lfu
                      JOIN book b ON lfu.isbn = b.isbn
            GROUP BY lfu.isbn, b.title, b.author, lfu.city, lfu.state,
                      lfu.country
            HAVING COUNT(lfu.userId) > 2
        ),
        ranked_books AS (
            SELECT
                gpb.isbn,
                gpb.title,
                gpb.author,
                gpb.review_count,
                gpb.avg_rating,
                gpb.city,
                gpb.state,
                gpb.country,
                ROW_NUMBER() OVER (
                    PARTITION BY gpb.city, gpb.state, gpb.country
                    ORDER BY gpb.avg_rating DESC, gpb.review_count DESC
                    ) AS rank
            FROM geographic_popular_books gpb
        )
      SELECT city, state, country, isbn, title, author, review_count,
            avg_rating, rank
      FROM ranked_books
      WHERE rank BETWEEN 1 AND 5
      ORDER BY city, state, country;
      `,
      [lat, long]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing popular books by location query", err);
    res
      .status(500)
      .json({ error: "Failed to execute popular books by location query" });
  }
};

// Route XX: GET /top-reviewer-favorites/:genre
const topReviewerFavorites = async(req, res) => {
  const threshold = req.params.threshold ?? 10;
  const genre = req.params.genre;

  if(!genre) {
    return res.status(400).json({error: "Genre paramater is required"});
  }

  try {
    const response = await connection.query (
      `WITH top_reviewers AS (
        SELECT userId
        FROM review
        GROUP BY userId
        HAVING count(*) > ${threshold}
     ), top_reviewer_books AS (
        SELECT r.isbn, r.userId
        FROM review r JOIN top_reviewers ts ON r.userid = ts.userid
     ), top_reviewer_scores AS (
       SELECT trb.isbn, ROUND(CAST(AVG(r.score) AS numeric), 2) AS avg_top_reviewer_score
       FROM review r JOIN top_reviewer_books trb ON r.isbn = trb.isbn AND r.userid = trb.userid
       GROUP BY trb.isbn
     ), genre_filtered_books AS (
        SELECT
            b.isbn,
            b.title,
            b.author,
            b.genre_id
        FROM book b JOIN genre g ON b.genre_id = g.genre_id
        WHERE g.genre = '${genre}'
     ), all_top_reviewer_books AS (
        SELECT
            gfb.isbn,
            gfb.title,
            gfb.author,
            COUNT(trb.userid) AS top_reviewer_count,
            trs.avg_top_reviewer_score
        FROM genre_filtered_books gfb JOIN
            top_reviewer_books trb ON gfb.isbn = trb.isbn JOIN
            top_reviewer_scores trs ON gfb.isbn = trs.isbn
        GROUP BY gfb.isbn, gfb.title, gfb.author, trs.avg_top_reviewer_score
     ), distinct_author_book_combos AS (
        SELECT DISTINCT ON (author)
            isbn,
            title,
            author,
            top_reviewer_count,
            avg_top_reviewer_score as avg_rating
        FROM all_top_reviewer_books
        ORDER BY author, title, top_reviewer_count DESC, avg_rating
     )
     SELECT *
     FROM distinct_author_book_combos
     ORDER BY top_reviewer_count DESC, avg_rating;`
    );
    res.json(response.rows);
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json({error: "Failed to execute top reviewer favorites query"})
  }
}

// Route XX: /magnum-opus
const magnumOpus = async (req, res) => {
  const author = req.params.author;

  if(!author){
    return res.status(400).json({error: "Author is required"});
  }

  try {
    const response = await connection.query (
    `
    WITH review_summary AS (
      SELECT
          isbn,
          AVG(score) as avg_rating
      FROM review
      GROUP BY isbn
   )
   SELECT b.isbn, b.title, b.author, rs.avg_rating
   FROM book b JOIN review_summary rs ON b.isbn = rs.isbn
   WHERE b.author LIKE '%${author}%'
   ORDER BY avg_rating DESC
   LIMIT 1;
    `);
    res.json(response.rows);
  } catch (err) {
    console.error("Error executing magnum opus query");

    res
      .status(500)
      .json({error: "Failed to execute magnum opus query"});
  }


}


// export routes
module.exports = {
  testDatabaseConnection,
  search,
  random,
  popularBooksByLocation,
  topReviewerFavorites,
  magnumOpus,
  
};
