import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Booking } from "../entities/Booking";
 import { Category } from "../entities/Category";
// import { Product } from "../entities/Product";
import { Role } from "../entities/Role";
import { Status } from "../entities/Status";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";
import { BookingProducts } from "../entities/BookingProducts";

dotenv.config();

const { DB_PASSWORD, DB_DATABASE, DB_USER, DB_HOST, DB_PORT } = process.env;

export const dataSource = new DataSource({
  entities: [User, Booking, Category, Role, Status, Product, ProductVariant, BookingProducts],
  synchronize: true,
  logging: ["error", "query"],
  type: "postgres",
  database: DB_DATABASE,
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT!),
});
