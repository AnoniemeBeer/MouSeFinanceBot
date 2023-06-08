const mariadb = require('mariadb');
const dotenv = require('dotenv');

class DatabaseConnection {

    private static config = dotenv.config().parsed;
    private static pool = mariadb.createPool({
        host: this.config.DATABASE_HOST,
        port: this.config.DATABASE_PORT,
        user: this.config.DATABASE_USER,
        password: this.config.DATABASE_USER_PASSWORD,
        database: this.config.DATABASE_SCHEMA,
        connectionLimit: 5,
    });
    private static connection;

    public static async connect(){
        try {
            this.connection = await this.pool.getConnection();
            return this.connection;
        } catch (err) {
            return false;
        }
    };

    public static async query(query: string, conn = this.connection){
        try {
            var result = await conn.query(query);
            return result;
          } catch (err) {
            return false;
          }
    };

    public static async disconnect(): Promise<boolean>{
        try {
            await this.connection.end();
            await this.pool.end();
        } catch (err) {
            return false;
        }
        return true;
    }
}