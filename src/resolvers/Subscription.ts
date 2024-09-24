import { withFilter } from 'graphql-subscriptions'
import { Resolvers } from "../__generated__/resolvers-types";
import { NewMessageEvent } from "../datasources/models"

export const Subscription: Resolvers = {
  Subscription: {
    listenForMessageInConversation: {
      // @ts-ignore
      subscribe: async (_, { fromMessageReceivedAt, id }, { pubsub, dataSources }) => {
          // GOAL: If a cursor `fromMessageReceivedAt` is passed, fetch all messages sent after
          
          // Check whether a timestamp was passed
          const timestampMs = parseInt(fromMessageReceivedAt);

         
          // Validate that timestamp is a number, if so retrieve messages sent after that timestamp
          if (!isNaN(timestampMs) && timestampMs > 0) {
            const messages = await dataSources.db.getMessagesAfterDate(timestampMs, id)
            
            return {
              // Set up the generator
              async *[Symbol.asyncIterator]() {
                
                console.log("I am called the first time the subscription runs!")
                // Initially, iterate through all the messages to "play back" what was missed
                // We're not awaiting NEW messages, just yielding the messages we already have in DB
                for (let i = 0; i < messages.length; i++) {
                  yield { listenForMessageInConversation: messages[i] }
                }

                console.log("creating a new iterator each time")
                // The thing we want to do with every new message
                let iterator = {
                   [Symbol.asyncIterator]: () => pubsub.asyncIterator<NewMessageEvent>(["NEW_MESSAGE_SENT"])
                  // [Symbol.asyncIterator]: filtered
                }

                // The loop that awaits new message events and yields them?
                for await (const event of iterator) {
                  // is there a better way that we can filter here? withFilter has a hard time
                  if (event.conversationId == id) {
                    yield event;
                  }
                }
              
            }
          }

        // If no timestamp is passed, handle new messages as we normally would
        }
          return pubsub.asyncIterator(["NEW_MESSAGE_SENT"])
      },
      // subscribe: withFilter(
      //   (_, __, { pubsub }) => {
      //   return pubsub.asyncIterator(["NEW_MESSAGE_SENT"])
      //   }, (payload, variables) => {
      //     return payload.conversationId === variables.id
      // })

    }
  }
}