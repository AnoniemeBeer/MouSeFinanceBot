import * as mariadb from 'mariadb';
import * as dotenv from 'dotenv';

export default class DatabaseConnection{
    private static config: dotenv.DotenvParseOutput = dotenv.config().parsed || {};
    
    private static pool = mariadb.createPool({
        host: this.config.DATABASE_HOST,
        port: parseInt(this.config.DATABASE_PORT),
        user: this.config.DATABASE_USER,
        password: this.config.DATABASE_USER_PASSWORD,
        database: this.config.DATABASE_SCHEMA,
        connectionLimit: 5,
    });

    private static connection: mariadb.PoolConnection;
    
    public static async connect(): Promise<any>{
        try {
            this.connection = await this.pool.getConnection();
        } catch (error) {
            console.log(error);
        }
    };

    public static async disconnect(): Promise<any>{
        try {
            await this.connection.end();
            await this.pool.end();
        } catch (error) {
            console.log(error);
        }
    };
    
    public static async query(query: string): Promise<any>{
        try {
            let results = await this.connection.query(query);
            return results;            
        } catch (error) {
            console.log(error);
        }
    };
}