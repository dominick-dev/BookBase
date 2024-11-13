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

// get polarizing books
const polarizingBooks = async (req, res) => {
  try {

      const result = await connection.query(`
        WITH highScoreCounts AS (
          SELECT isbn, COUNT(*) AS count
          FROM review r WHERE r.Score > 8
          GROUP BY isbn),
        midScoreCounts AS (
          SELECT isbn, COUNT(*) AS count
          FROM review r WHERE r.Score BETWEEN 3 AND 8
          GROUP BY ISBN
        ),
        lowScoreCounts AS (
          SELECT ISBN, COUNT(*) AS count
          FROM review    r WHERE r.Score < 3
          GROUP BY ISBN
        ),
        allCounts AS (
          SELECT COALESCE(low.isbn, mid.isbn, high.isbn) AS isbn,
                  COALESCE(low.count, 0) AS lowScoreCount,
                  COALESCE(mid.count, 0) AS midScoreCount,
                  COALESCE(high.count, 0) AS highScoreCount
          FROM
              midScoreCounts mid
          FULL OUTER JOIN lowScoreCounts low ON mid.isbn = low.isbn
          FULL OUTER JOIN highScoreCounts high ON COALESCE(mid.isbn, low.isbn) = high.isbn
        )
        SELECT b.isbn,
              b.title,
              b.author,
              allCounts.highScoreCount AS highScoreCount,
              allCounts.midScoreCount AS midScoreCount,
              allCounts.lowScoreCount AS lowScoreCount
        FROM book b
        LEFT JOIN allCounts ON b.isbn = allCounts.isbn
        WHERE highScoreCount > midScoreCount and lowScoreCount > midScoreCount
        ORDER BY lowScoreCount + midScoreCount + highScoreCount DESC;
      `);
    console.log(result.rows.slice(0, 1000));
    res.json(result.rows.slice(0, 1000));
  } catch (err) {
    console.error("Error fetching polarizing books", err);
    res.status(500).json({ error: "Failed to fetch polarizing books." });
  }
};

// get books by age group
const byAgeGroup = async (req, res) => {
  try {

      const {ageGroup} = req.query;
      const definedGroups = ['Under 18', '18-30', '31-50', '51-65', '65+'];
      if (!definedGroups.includes(ageGroup)) {
        return res.status(400).json({error: "Requested age group not defined."})
      }


      const result = await connection.query(`
        WITH age_groups AS (
          SELECT
              p.userId,
              r.isbn,
              CASE
                  WHEN 2024 - p.birthYear < 18 THEN 'Under 18'
                  WHEN 2024 - p.birthYear BETWEEN 18 AND 30 THEN '18-30'
                  WHEN 2024 - p.birthYear BETWEEN 31 AND 50 THEN '31-50'
                  WHEN 2024 - p.birthYear BETWEEN 51 AND 65 THEN '51-65'
                  WHEN 2024 - p.birthYear > 65 THEN '65+'
                  ELSE 'Unknown'
              END AS age_group,
              r.score
          FROM person p
          JOIN review r ON p.userId = r.userId
          WHERE p.birthYear IS NOT NULL
        ),
        age_group_popular_books AS (
          SELECT
              ag.age_group,
              b.isbn,
              b.title,
              b.author,
              COUNT(ag.userId) AS review_count,
              ROUND(cast(AVG(ag.score) as numeric), 2) AS avg_rating
          FROM age_groups ag
          JOIN book b ON ag.isbn = b.isbn
          GROUP BY ag.age_group, b.isbn, b.title, b.author
        ), ranked_books AS (
          SELECT
              agpb.age_group,
              agpb.isbn,
              agpb.title,
              agpb.author,
              agpb.review_count,
              agpb.avg_rating,
              ROW_NUMBER() OVER (
                  PARTITION BY agpb.age_group
                  ORDER BY agpb.review_count DESC, agpb.avg_rating DESC
              ) AS rank
          FROM age_group_popular_books agpb
        )
        SELECT age_group, isbn, title, author, review_count, avg_rating, rank
        FROM ranked_books
        WHERE rank BETWEEN 1 AND 5 AND age_group = $1
        ORDER BY age_group;
      `, [ageGroup]);
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching books by age group", err);
    res.status(500).json({ error: "Failed to fetch books by age group."});
  }
};

// get books by location
const byLocation = async (req, res) => {
  try {

      const {column, placeName} = req.query;
      const definedColumns = ['city', 'state', 'country'];
      if (!definedColumns.includes(column)) {
        return res.status(400).json({error: "Requested column not defined."})
      }


      const result = await connection.query(`
          SELECT b.isbn, b.title, b.author, COUNT(r.userid) AS reviewCount
          FROM book b
          JOIN review r ON b.isbn = r.isbn
          JOIN person p ON r.userid = p.userid
          JOIN location l ON p.location_id = l.location_id
          WHERE l.${column} LIKE $1
          GROUP BY b.isbn, b.title, b.author
          ORDER BY reviewCount DESC;
      `, [`%${placeName}%`]);
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching books by location", err);
    res.status(500).json({ error: "Failed to fetch books by location."});
  }
};

// export routes
module.exports = {
  testDatabaseConnection,
  search,
  random,
  popularBooksByLocation,
  polarizingBooks,
  byAgeGroup,
  byLocation,
};
