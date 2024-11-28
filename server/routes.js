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

      const {birthYear} = req.params;
      const birthYearInt = parseInt(birthYear); // attempt to parse

      // check for parsing success
      if (isNaN(birthYearInt)) {
        return res.status(400).json({error: "Invalid birth year."})
      }

      const age = new Date().getFullYear() - birthYearInt;

      if (age < 0) {
        return res.status(400).json({error: "Invalid birth year."})
      }

      let ageGroup;

      if (age < 18) {
        ageGroup = "Under 18";
      } else if (age <= 30) {
        ageGroup = "18-30";
      } else if (age <= 50) {
        ageGroup = "31-50";
      } else if (age <= 65) {
        ageGroup = "51-65";
      } else {
        ageGroup = "65+";
      }

      // const definedGroups = ['Under 18', '18-30', '31-50', '51-65', '65+'];
      // if (!definedGroups.includes(ageGroup)) {
      //   return res.status(400).json({error: "Requested age group not defined."})
      // }


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

      const {column, placeName} = req.params;
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


// ROUTE XXX: /hidden-gems
const hiddenGems = async (req, res) => {

  const minRating = parseFloat(req.query.minRating ) || 9.0;
  const maxReviews = parseInt(req.query.maxReview) || 8;

  try {
    const result = await connection.query(
      `
      WITH review_summary AS (
        SELECT
            isbn,
            avg(score) as avg_rating,
            COUNT (userId) as review_count
        FROM review
        GROUP BY isbn
        HAVING AVG(score) >= ${minRating} AND COUNT(userId) < ${maxReviews}
     )
      SELECT
          b.isbn,
          b.title,
          b.author,
          rs.avg_rating,
          rs.review_count
      FROM book b JOIN review_summary rs ON b.isbn = rs.isbn
      WHERE b.author IS NOT NULL
      ORDER BY rs.avg_rating DESC, rs. review_count DESC;
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing hidden gems query")

    res
    .status(500)
    .json({error: "Failed to execute hidden gems query",
      
    })
  }
}

// Route XX: /helpful-users
const helpfulUsers = async (req, res) => {
  
  const minNumVotes = parseInt(req.query.minNumVotes, 10 ) || 5;
  const maxUsers = parseInt(req.query.maxUsers, 10) || 10;

  // Validation on the parameters if they're given
  if (minNumVotes < 0) {
    return res.status(400).json({ error: "Invalid minNumVotes provided. Please provide a positive integer." });
  }
  if (maxUsers < 0) {
    return res.status(400).json({ error: "Invalid maxUsers provided. Please provide a positive integer." });
  }

  try {
    const result = await connection.query(
      `
      WITH calc_help AS (
        SELECT
            u.userid AS userid,
            COALESCE(r.username, 'Unknown') AS username,
            COUNT(*) AS num_reviews,
            COUNT(DISTINCT r.isbn) AS n_books,
            SUM(SPLIT_PART(r.helpfulness, '/', 2)::float) AS num_votes,
            AVG(SPLIT_PART(r.helpfulness, '/', 1)::float
                / SPLIT_PART(r.helpfulness, '/', 2)::float
            ) AS avg_user_helpfulness
        FROM
            review r
        LEFT JOIN
            person u ON r.userid = u.userid
        WHERE
            r.helpfulness IS NOT NULL
            AND SPLIT_PART(r.helpfulness, '/', 2)::float != 0
        GROUP BY
            u.userid, r.username
      )
      SELECT
          userid,
          username,
          avg_user_helpfulness * num_votes AS weighted_user_helpfulness,
          avg_user_helpfulness,
          num_reviews,
          num_votes,
          n_books
      FROM
        calc_help
      WHERE
        num_votes >= $1
      ORDER BY
        weighted_user_helpfulness DESC
      LIMIT $2
      `,
      [minNumVotes, maxUsers]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing helpful-users query")

    res
    .status(500)
    .json({error: "Failed to execute helpful-users query",
      
    })
  }
}

// Route XX: /author-stats
const authorStats = async (req, res) => {
  
  // Optional author name param
  const authorName = req.query.authorName ? req.query.authorName.toString() : null;
  const numAuthors = parseInt(req.query.numAuthors, 10) || 10;

  // data validation
  if (isNaN(numAuthors) || numAuthors < 0) {
    return res.status(400).json({ error: "Invalid numAuthors provided. Please provide a positive integer." });
  }

  try {
    const result = await connection.query(
      `
      SELECT
        b.author, 
        COUNT(b.isbn) AS n_books,
        COUNT(r.userid) AS n_reviews,
        AVG(r.score) AS avg_rating,
        AVG(r.price) AS avg_price
      FROM
        book b
      JOIN
        review r ON b.isbn = r.isbn
      WHERE
        b.author IS NOT NULL
        AND ($1::text IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', $1, '%')))
      GROUP BY
        b.author
      ORDER BY
        n_reviews DESC, n_books DESC, avg_rating DESC
      LIMIT $2;
      `,
      [authorName, numAuthors]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing author-stats query", err)

    res
    .status(500)
    .json({error: "Failed to execute author-stats query"})
  }
}

// Route XX: /genre-stats
const genreStats = async (req, res) => {
  // Optional author name param
  const genreName = req.query.genreName ? req.query.genreName.toString() : null;
  const numGenres = parseInt(req.query.numGenres, 10) || 10;

  // data validation
  if (isNaN(numGenres) || numGenres < 0) {
    return res.status(400).json({ error: "Invalid numGenres provided. Please provide a positive integer." });
  }

  try {
    const result = await connection.query(
      `
      SELECT
        g.genre
        , AVG(r.score) AS avg_rating
        , AVG(CASE WHEN r.helpfulness IS NOT NULL AND SPLIT_PART(r.helpfulness, '/', 2)::float != 0 THEN
            SPLIT_PART(r.helpfulness, '/', 1)::float / SPLIT_PART(r.helpfulness, '/', 2)::float
        END) AS avg_helpfulness
        , AVG(r.price) AS avg_price
        , COUNT(r.isbn) AS num_reviews
      FROM
        genre g
      JOIN
        book b
        ON g.genre_id = b.genre_id
      JOIN
        review r
        ON b.isbn = r.ISBN
      WHERE
        ($1::text IS NULL OR LOWER(g.genre) LIKE LOWER(CONCAT('%', $1, '%')))
      GROUP BY
        g.genre
      ORDER BY
        avg_rating DESC
      LIMIT $2;
      `,
      [genreName, numGenres]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing genre-stats query", err)

    res
    .status(500)
    .json({error: "Failed to execute genre-stats query"});
  }
}

const get20Books = async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM book WHERE image IS NOT NULL LIMIT 20");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing getAllBooks:", err.message, err.stack);
    res.status(500).json({ error: "Failed to retrieve books from the database." });
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
  topReviewerFavorites,
  magnumOpus,
  hiddenGems,
  helpfulUsers,
  authorStats,
  genreStats,
  get20Books,
  connection
};
