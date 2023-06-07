const mariadb = require('mariadb');
const dotenv = require('dotenv');

const config = dotenv.config().parsed;

const pool = mariadb.createPool({
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  user: config.DATABASE_USER,
  password: config.DATABASE_USER_PASSWORD,
  database: config.DATABASE_SCHEMA,
  connectionLimit: 5,
});

let query:string = "SELECT * FROM User;";

(async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected to the database!");

    var result = await conn.query(query);

    console.log(result);
  } catch (err) {
    console.error("Error connecting to the database:", err);
  } finally {
    await conn.end();
    await pool.end();
  }
})();