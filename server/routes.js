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

// export routes
module.exports = {
  testDatabaseConnection,
};
