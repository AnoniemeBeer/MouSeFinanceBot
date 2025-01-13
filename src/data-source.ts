import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User, Purchase, Subscription } from "./entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: parseInt(process.env.DATABASE_PORT || "3306"),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_USER_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  synchronize: true,
  logging: false,
  entities: [User, Purchase, Subscription],
  migrations: ["./migration/*.ts"],
  subscribers: [],
});
