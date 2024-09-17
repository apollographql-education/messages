import { Resolvers } from "../__generated__/resolvers-types";

export const Mutation: Resolvers = {
  Mutation: {
    createConversation: async (_, { recipientId }, { dataSources, userId }) => {
      const [sender, receiver] = [userId, recipientId].map((id) => parseInt(id))
      return dataSources.db.createNewConversation({ userId: sender, recipientId: receiver })
    },
    sendMessage: async (_, { message }, { pubsub, dataSources, userId }) => {
      const { conversationId, text } = message;
      const [conversation, sender] = [conversationId, userId].map((id) => parseInt(id))
      const { id, text: messageText, sentFrom, sentTo, sentTime, ...messageAttributes } = await dataSources.db.sendMessageToConversation({ conversationId: conversation, text, userId: sender });
      const subscriptionMessage = { id, text: messageText, sentTo, sentFrom, sentTime }
      
      // Issue new message event for subscription, pass along conversation ID and only relevant attributes
      await pubsub.publish("NEW_MESSAGE_SENT", { listenForMessageInConversation: subscriptionMessage, conversationId })
      
      // Return all of the message that was created
      return { ...subscriptionMessage, ...messageAttributes };
    }
  }
}