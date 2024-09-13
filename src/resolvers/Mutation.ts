import { Resolvers } from "../__generated__/resolvers-types";

export const Mutation: Resolvers = {
  Mutation: {
    createConversation: async (_, { recipientId }, { dataSources, userId }) => {
      const [sender, receiver] = [userId, recipientId].map((id) => parseInt(id))
      return dataSources.db.createNewConversation({ userId: sender, recipientId: receiver })
    }
  }
}