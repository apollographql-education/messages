import { StandaloneServerContextFunctionArgument } from "@apollo/server/dist/esm/standalone";
import { PrismaClient } from "@prisma/client";
import { PrismaDbClient } from "./prisma/client"


export const createContext = async ({ req }: StandaloneServerContextFunctionArgument) => {
  const token = req.headers.authorization || "";
  const userId = token.split(" ")[1];
  return {
    userId,
    dataSources: {
      db: new PrismaDbClient()
    }
  }
};
