import { AuthenticationError } from "../utils/errors";
import { Resolvers } from "../__generated__/resolvers-types";
import { Prisma } from "@prisma/client";

export const Mutation: Resolvers = {
  Mutation: {
    createConversation: async (_, { recipientId }, { dataSources, userId }) => {
      if (!userId) throw AuthenticationError();
      if (userId === recipientId) throw Error("You can't start a conversation with yourself! Maybe try talking to the mirror instead?")

      const [sender, receiver] = [userId, recipientId].map((id) => parseInt(id))

      try {
        // Grab user's conversations
        const user = await dataSources.prisma.user.findUnique({
          where: {
            id: sender
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

        // User could not be found
        if (!user) {
          throw Error("Please provide a valid token")
        }

        const { conversation: conversationsArray } = user;

        // see if a conversation exists with recipient
        const matchedConversation = conversationsArray.filter(({ conversation }) => {
          // Only return the conversation that contains the recipient's ID
          return conversation.participants.find(participant => participant.participantId === parseInt(recipientId))
        })
    

        if (matchedConversation.length) {
          throw Error("A conversation already exists between you and the recipient")
        }


        const createdConversation = await dataSources.prisma.conversation.create({
          data: {
            participants: {
            create: [
              {
                participant: {
                  connect: {
                    id: sender
                  }
                }
              },
              {
                participant: {
                  connect: {
                    id: receiver
                  }
                }
              }
            ]
            }
          }
        })

        const { id: conversationId, openedTime, ...conversationAttributes } = createdConversation;
    
      
        return {
          // Schema expects ID to be a string
          id: conversationId.toString(),
          createdAt: openedTime.toString(),
          ...conversationAttributes
        }
      
      } catch (e) {
        // If conversation creation fails, throw error
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.log(e)
          throw Error("The operation failed because one or more records could not be found")
        }
        throw Error(e.message)
      }
    }
  }
}