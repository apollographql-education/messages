import { Resolvers } from "../__generated__/resolvers-types";

export const Query: Resolvers = {
  Query: {
    async conversation(_, { id }, {prisma}) {
      const existingConversation = await prisma.conversation.findUnique({
        where: {
          id: parseInt(id)
        },
      })
      return {
        id: "1"
      }
    }
  }
}
