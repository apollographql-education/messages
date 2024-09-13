import { AuthenticationError } from "../utils/errors";
import { Resolvers } from "../__generated__/resolvers-types";

export const Query: Resolvers = {
  Query: {
    conversations: async (_, __, { dataSources, userId }) => {
      if (!userId) throw AuthenticationError();

      try {
        // Find conversations where user is a participant
        const conversations = await dataSources.prisma.conversationParticipant.findMany({
          where: {
            participantId: parseInt(userId)
          },
          include: {
            conversation: true
          }
        })

        // If there are conversations, map through and return their properties
        return conversations.length ? conversations.map(({ conversation: { id, openedTime, ...conversationAttributes } }) => {
          return {
            id: id.toString(),
            createdAt: openedTime.toString(),
            ...conversationAttributes
          }
        }) : []

      } catch (e) {
        console.log(e)
        throw Error("No conversations found")
      }
    },
    conversation: async (_, { recipientId }, { dataSources, userId }) => {

      if (!userId) throw AuthenticationError();
      if (userId === recipientId) throw Error("Please provide a recipient ID different from your own")

      try {
        // Grab user's conversations
        const { conversation: conversationsArray } = await dataSources.prisma.user.findUnique({
          where: {
            id: parseInt(userId)
          },
          include: {
            conversation: {
              include: {
                conversation: {
                  include: {
                    participants: true
                  }
                }
              }
            }
          }
        })

        // find conversation that has recipient as participant
        const [{conversation: matchedConversation}] = conversationsArray.filter(({ conversation }) => {
          // Only return the conversation that contains the recipient's ID
          return conversation.participants.find(participant => participant.participantId === parseInt(recipientId))
        })
    
        // Now fetch additional details about this conversation using the ID we found
        const { id: conversationId, openedTime, ...conversationAttributes } = await dataSources.prisma.conversation.findUnique({
          where: {
            id: matchedConversation.id 
          },
        })
      
      return {
        // Schema expects ID to be a string
        id: conversationId.toString(),
        createdAt: openedTime.toString(),
        ...conversationAttributes
      }
      
      } catch (e) {
        // If conversation lookup fails, throw error
        console.log(e)
        throw Error("Conversation not found")
      }
    }
  }
}
