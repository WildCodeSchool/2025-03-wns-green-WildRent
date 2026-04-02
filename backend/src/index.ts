
import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();
import { dataSource } from "./config/db";
import { buildSchema } from "type-graphql";
import { ApolloServer }  from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import UserResolver from "./resolvers/UserResolver";
import AuthResolver from "./resolvers/AuthResolver";
import { AnonContext, AuthContext } from "./types/types";
import { BookingResolver } from "./resolvers/BookingResolver";
import CategoryResolver from "./resolvers/CategoryResolver";
import RoleResolver from "./resolvers/RoleResolver";
import { StatusResolver } from "./resolvers/StatusResolver";
import ProductResolver from "./resolvers/ProductResolver";
import ProductVariantResolver from "./resolvers/ProductVariantResolver";
import { customErrorFormatter  } from "./errors/customErrorFormatter";
import { BookingProductsResolver } from "./resolvers/BookingProductsResolver";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';

type Query = {
  _empty: String
}
async function startServer() {
  await dataSource.initialize();

  const schema = await buildSchema ({
    resolvers: [UserResolver, AuthResolver, BookingResolver, CategoryResolver, StatusResolver, ProductResolver, RoleResolver, ProductVariantResolver, BookingProductsResolver],
    validate: true,
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: customErrorFormatter,
  });

  await apolloServer.start();

  const app = express();

  app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
  }));

  app.use(express.json())
  app.use("/graphql", expressMiddleware(apolloServer, {
    context: async({req, res}) => {
      const context : AnonContext | AuthContext = { req, res };
      return context
    }
  }));

app.listen(4200, () => {
console.log("✅ Server started on http://localhost:4200/graphql");
});
};
startServer();
