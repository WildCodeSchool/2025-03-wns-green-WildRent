
import "reflect-metadata"; 
import * as dotenv from "dotenv";
import { dataSource } from "./config/db";
import { buildSchema } from "type-graphql";
import { ApolloServer }  from "@apollo/server"; 
import { startStandaloneServer } from "@apollo/server/standalone";
import CategoryResolver from "./resolvers/CategoryResolver";
import UserResolver from "./resolvers/UserResolver";
import ProductResolver from "./resolvers/ProductResolver";
import BookingResolver from "./resolvers/BookingResolver";
import BookingProductsResolver from "./resolvers/BookingProductsResolver";
import RoleResolver from "./resolvers/RoleResolver";
import StatusResolver from "./resolvers/StatusResolver";

dotenv.config();

async function startServer() {
  await dataSource.initialize(); 
  const schema = await buildSchema ({
    resolvers: [UserResolver]
  })
  const apolloServer = new ApolloServer({ schema }); 
  const { url } = await startStandaloneServer(apolloServer, {
    listen: {port: 4200}}
); 
  console.log("Server started on" + url);
}; 
startServer(); 

