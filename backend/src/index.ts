
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


type Query = {
  _empty: String
}
async function startServer() {
  await dataSource.initialize();
  const schema = await buildSchema ({
    resolvers: [UserResolver, AuthResolver, BookingResolver, CategoryResolver,StatusResolver,RoleResolver],
  })
  const apolloServer = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(apolloServer, {
    listen: {port: 4200},
    context: async({req, res}) => {
      const context : AnonContext | AuthContext = {
        req, 
        res
      };
      return context
    }
  });
  console.log("✅ Server started on " + url);
};
startServer();
