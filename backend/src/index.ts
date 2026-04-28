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
import { AuthService } from "./services/auth.service";
import uploadRouter from "./routes/upload";

const authService = new AuthService();

/**
 * Parses cookies from the request headers.
 * Returns a key-value map of cookie names and values.
 */
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    })
  );
}

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
    context: async ({ req, res }): Promise<AnonContext | AuthContext> => {
      const cookies = parseCookies(req.headers.cookie);
      const token = cookies["WildRentAuthToken"];

      if (token) {
        const user = authService.verifyToken(token);
        if (user) {
          return { req, res, user };
        }
      }

      return { req, res };
    },
  }));

  app.listen(PORT, () => {
    console.log(`✅ Server started on http://localhost:${PORT}/graphql`);
  });
}

startServer();
