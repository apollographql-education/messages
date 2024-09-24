import { Resolvers } from "../__generated__/resolvers-types";

export const Subscription: Resolvers = {
  Subscription: {
    listenForMessageInConversation: {
      subscribe: (_, __, { pubsub }) => {
        return {
          [Symbol.asyncIterator]: () => pubsub.asyncIterator(["NEW_MESSAGE_SENT"])
        }
      }
    },
  },
};