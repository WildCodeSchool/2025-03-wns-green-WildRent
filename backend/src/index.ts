
import "reflect-metadata";
import * as dotenv from "dotenv";
import { dataSource } from "./config/db";
import { buildSchema } from "type-graphql";
import { ApolloServer }  from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import UserResolver from "./resolvers/UserResolver";
import AuthResolver from "./resolvers/AuthResolver";
import { BookingResolver } from "./resolvers/BookingResolver";

type Query = {
  _empty: String
}

dotenv.config();

async function startServer() {
  await dataSource.initialize();
  const schema = await buildSchema ({
    resolvers: [UserResolver, AuthResolver, BookingResolver]
  })
  const apolloServer = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(apolloServer, {
    listen: {port: 4200}}
);
  console.log("✅ Server started on " + url);
};
startServer();
