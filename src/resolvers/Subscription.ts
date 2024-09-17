import { withFilter } from 'graphql-subscriptions'
import { Resolvers } from "../__generated__/resolvers-types";

export const Subscription: Resolvers = {
  Subscription: {
    listenForMessageInConversation: {
      // @ts-ignore
      subscribe: withFilter(
        (_, __, { pubsub }) => {
        return pubsub.asyncIterator(["NEW_MESSAGE_SENT"])
        }, (payload, variables) => {
          return payload.conversationId === variables.id
      })
    }
  }
}