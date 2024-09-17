import { withFilter } from 'graphql-subscriptions'
import { Resolvers } from "../__generated__/resolvers-types";

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
                for (let i = 0; i < messages.length; i++) {
                  yield { listenForMessageInConversation: messages[i] }
                }

                console.log("creating a new iterator each time")
                // The thing we want to do with every new message
                let iterator = {
                  [Symbol.asyncIterator]: () => pubsub.asyncIterator(["NEW_MESSAGE_SENT"])
                }

                // The loop that awaits new message events and yields them?
                for await (const v of iterator) {
                  console.log("I get called every time there's a new message")
                  yield v;
                }
              }
            }
          }

        // If no timestamp is passed, handle new messages as we normally would
        return pubsub.asyncIterator(["NEW_MESSAGE_SENT"])
        }
    }
    // listenForMessageInConversation: {
    //   // @ts-ignore
    //   subscribe: withFilter(
    //     (_, { fromMessageReceivedAt, id }, { pubsub, dataSources }) => {
    //       // GOAL: If a cursor `fromMessageReceivedAt` is passed, fetch all messages sent after
          
    //       // Check whether a timestamp was passed
    //       const timestampMs = isNaN(fromMessageReceivedAt) ? 0 : parseInt(fromMessageReceivedAt);
         
    //       // Validate that timestamp is a number, if so retrieve messages sent after that timestamp
    //       if (!isNaN(timestampMs) && timestampMs > 0) {
    //         const messages = dataSources.db.getMessagesAfterDate(timestampMs, id)
            
    //         return {
    //           async *[Symbol.asyncIterator]() {
    //             for (let i = 0; i < messages.length; i++) {
    //               console.log(messages[i])
    //               yield { newMessages: messages[i]}
    //             }

    //             let iterator = {
    //               [Symbol.asyncIterator]: () => pubsub.asyncIterator(["NEW_MESSAGE_SENT"])
    //             }

    //             for await (const v of iterator) {
    //               yield v;
    //             }
    //           }
    //         }
    //       }


    //     return pubsub.asyncIterator(["NEW_MESSAGE_SENT"])
    //     }, (payload, variables) => {
    //       return payload.conversationId === variables.id
    //   })
    // }
  }
}