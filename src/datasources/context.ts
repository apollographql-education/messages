import { StandaloneServerContextFunctionArgument } from "@apollo/server/dist/esm/standalone";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createContext = async ({ req }: StandaloneServerContextFunctionArgument) => {
  const token = req.headers.authorization || "";
  const userId = token.split(" ")[1];
  return {
    userId,
    dataSources: {
      prisma: prisma,
    }
  }
};
