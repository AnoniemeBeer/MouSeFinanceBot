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

const createUserTable = "CREATE TABLE `User` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `discordId` varchar(150) NOT NULL, PRIMARY KEY (`id`));";
const createPurchasesTable = "CREATE TABLE `Purchases` (`id` int NOT NULL AUTO_INCREMENT, `description` varchar(500) NOT NULL , `price` double NOT NULL, `userId` int NOT NULL, PRIMARY KEY (`id`), KEY `FK_1` (`userId`), CONSTRAINT `FK_1` FOREIGN KEY `FK_1` (`userId`) REFERENCES `User` (`id`));";

(async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected to the database!");

    console.log("Dropping tables...");
    await conn.query("DROP TABLE IF EXISTS Purchases;");
    await conn.query("DROP TABLE IF EXISTS User;");
    console.log("Tables dropped!");

    console.log("Creating tables...");

    console.log("Starting User table...");
    await conn.query(createUserTable);
    console.log("User table created!");

    console.log("Starting Purchases table...");
    await conn.query(createPurchasesTable);
    console.log("Purchases table created!");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  } finally {
    await conn.end();
    await pool.end();
  }
})();