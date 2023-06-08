import mariadb from 'mariadb';
import dotenv from 'dotenv';

const config: dotenv.DotenvParseOutput|undefined = dotenv.config().parsed;

const pool = mariadb.createPool({
  host: config?config.DATABASE_HOST:"localhost",
  port: parseInt(config?config.DATABASE_PORT:"3306"),
  user: config?config.DATABASE_USER:"admin",
  password: config?config.DATABASE_PASSWORD:"admin",
  database: config?config.DATABASE_NAME:"mousefinance",
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