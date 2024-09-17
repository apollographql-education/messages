import { StandaloneServerContextFunctionArgument } from "@apollo/server/dist/esm/standalone";
import { PubSub } from "graphql-subscriptions";
import { PrismaDbClient } from "./prisma/client"

const pubsub = new PubSub();

export const createContext = async ({ req }: StandaloneServerContextFunctionArgument) => {
  const token = req.headers.authorization || "";
  const userId = token.split(" ")[1];
  return {
    userId,
    pubsub: pubsub,
    dataSources: {
      db: new PrismaDbClient()
    }
  }
};
