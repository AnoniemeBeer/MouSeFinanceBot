import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { User, Purchase } from "./entity";

const config: dotenv.DotenvParseOutput = dotenv.config().parsed || {};

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: config.DATABASE_HOST || "127.0.0.1",
    port: parseInt(config.DATABASE_PORT) || 3306,
    username: config.DATABASE_USER,
    password: config.DATABASE_USER_PASSWORD,
    database: config.DATABASE_SCHEMA,
    synchronize: true,
    logging: false,
    entities: [User, Purchase],
    migrations: ['./migration/*.ts'],
    subscribers: [],
})