import { Resolvers } from "../__generated__/resolvers-types";

export const Query: Resolvers = {
  Query: {
    conversation(_, { id }, {prisma}) {
      return { id: id.toString(), name: "Name" };
    },
  },
};
