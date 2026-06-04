import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User, Purchase, Subscription } from "./entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DATABASE_HOST || "database", // Use "database" as the fallback
  port: parseInt(process.env.DATABASE_PORT || "3306"),
  username: process.env.DATABASE_USER || "mariadb", // Add fallback for username
  password: process.env.DATABASE_USER_PASSWORD || "mariadb", // Add fallback for password
  database: process.env.DATABASE_SCHEMA || "database", // Add fallback for database name
  synchronize: true,
  logging: false,
  entities: [User, Purchase, Subscription],
  migrations: ["./migration/*.ts"],
  subscribers: [],
});
