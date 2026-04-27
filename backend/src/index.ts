import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { dataSource } from "./config/db";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";

import UserResolver from "./resolvers/UserResolver";
import AuthResolver from "./resolvers/AuthResolver";
import { BookingResolver } from "./resolvers/BookingResolver";
import CategoryResolver from "./resolvers/CategoryResolver";
import RoleResolver from "./resolvers/RoleResolver";
import { StatusResolver } from "./resolvers/StatusResolver";
import ProductResolver from "./resolvers/ProductResolver";
import ProductVariantResolver from "./resolvers/ProductVariantResolver";
import { BookingProductsResolver } from "./resolvers/BookingProductsResolver";
import { customErrorFormatter } from "./errors/customErrorFormatter";
import { AnonContext, AuthContext } from "./types/types";
import uploadRouter from "./routes/upload";

const PORT = process.env.PORT ?? 4200;

async function startServer() {
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      AuthResolver,
      BookingResolver,
      CategoryResolver,
      StatusResolver,
      ProductResolver,
      RoleResolver,
      ProductVariantResolver,
      BookingProductsResolver,
    ],
    validate: true,
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: customErrorFormatter,
  });

  await apolloServer.start();

  const app = express();

  app.use(cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }));

  app.use(express.json());
  app.use("/api", uploadRouter);
  app.use("/graphql", expressMiddleware(apolloServer, {
    context: async ({ req, res }) => {
      const context: AnonContext | AuthContext = { req, res };
      return context;
    },
  }));

  app.listen(PORT, () => {
    console.log(`✅ Server started on http://localhost:${PORT}/graphql`);
  });
}

startServer();
